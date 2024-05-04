import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { DragulaService } from 'ng2-dragula';
import { RatingScaleComponent } from '../rating-scale/rating-scale.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BmxService } from '../../../bmx.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-narrow-down',
  templateUrl: './narrow-down.component.html',
  styleUrls: ['./narrow-down.component.scss']
})
export class NarrowDownComponent extends RatingScaleComponent implements OnInit {
  @Input() bmxItem;
  @Input() i;
  @Input() bmxClientPageDesignMode;
  @Input() bmxClientPageOverview;
  SLECTED_ROWS = []
  deleteRows = false
  dragRows = false
  isColumnResizerOn = false;
  editSingleTableCells = false
  numRatingScale: number = 0;
  CREATION_VIDEO_PATH="assets/videos/NarrowDown.mp4" 
  dataSource:any[] = []

  constructor(dragulaService: DragulaService, _snackBar: MatSnackBar,  _bmxService: BmxService,public deviceService: DeviceDetectorService) {
    super(dragulaService,_snackBar, _bmxService,deviceService)
  }

  ngOnInit(): void {
    this.showDialog = false
    let selectedCriteria = [];
    if(this.bmxItem.componentText[0].CRITERIA){
      this.selectedCriteria = this.bmxItem.componentText[0].CRITERIA;
    }    
    if(this.bmxItem.componentText[0].hasOwnProperty("STARS")){
      this.numRatingScale = this.bmxItem.componentText[0].STARS.length
    }
    
    this.rankingScaleValue = this.numRatingScale;

    // COLUMN NAMES
    let values = Object.keys(this.bmxItem.componentText[0])

    values.forEach(value => {
      if (typeof value == "string" && value != "STARS" && value != "CRITERIA" && value != "SELECTED_ROW"   ) {
        this.columnsNames.push(value)
      }
    });

    

    let result = '';

    // Obtener las claves de la primera fila (los nombres de las propiedades)
    let firstObject = this.bmxItem.componentText[0];
    let columnNames = [];
    for (let key in firstObject) {
      if (key === 'Name Candidates' || key === 'Rationales' ) {
        columnNames.push(key);
      }
    }

    // Agregar cada objeto como una fila en el resultado
    for (let obj of this.bmxItem.componentText) {
      let values = [];
      for (let key in obj) {
        if (key === 'nameCandidates' || key === 'rationale' || key === 'name'){
          values.push(obj[key]);
        }
      }
      if (values.length > 0) {  // Verificar si hay valores para esta fila
        result += values.join('\t') + '\n';  // Agregar la línea al resultado
      }
      
    }
    this.testNamesInput = result;

    console.log(this.bmxItem.componentSettings)
    this.randomizeTestNames = this.bmxItem.componentSettings[0].randomizeTestNames
    this.rowsCount = this.bmxItem.componentText.length - 1;
    this.bmxItem.componentSettings[0].minRule = this.bmxItem.componentSettings[0].minRule == 0?0 :this.bmxItem.componentSettings[0].minRule;
    this.bmxItem.componentSettings[0].maxRule = this.bmxItem.componentSettings[0].maxRule == 0?0 :this.bmxItem.componentSettings[0].maxRule;

    if (this.bmxItem.componentSettings[0]['displaySound'] == true) {
      this.displaySound = true;
    }
    const filteredCriteria = this.CRITERIA.filter(criteriaItem => this.selectedCriteria.map(item => item.name).includes(criteriaItem.name));
    this.newselectedCriteria = filteredCriteria
    if(this.bmxItem.componentText[0]?.CRITERIA){
      this.rankingScaleValue = this.bmxItem.componentText[0]?.CRITERIA[0]?.STARS?.length;
    }
    this.dataSource = this.bmxItem.componentText.slice(1)
  }
}