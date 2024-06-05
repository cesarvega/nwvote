import { DragulaService } from 'ng2-dragula';
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { RatingScaleComponent } from '../rating-scale/rating-scale.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BmxService } from '../../../bmx.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-rank-scale',
  templateUrl: './rank-scale.component.html',
  styleUrls: ['./rank-scale.component.scss']
})
export class RankScaleComponent extends RatingScaleComponent implements OnInit {

  @Input() bmxItem;
  @Input() i;
  @Input() bmxClientPageDesignMode;
  @Input() bmxClientPageOverview;
  @Output() autoSave = new EventEmitter();
  showBar = false
  CREATION_VIDEO_PATH = "assets/videos/RankMatrix.mp4"
  VIDEO_PATH: any[] = [];

  PATH1: any[] = [
    'assets/img/bmx/tutorial/image-drag.JPG',

  ]

  PATH2: any[] = [
    'assets/img/bmx/tutorial/image-drag2.JPG',
  ]
  isImageType = true

  rankingType = 'dropDown'
  rankingTypeOptions = ['dropDown', 'dragAndDrop', 'radio', 'dinamycRadio']

  draggableBag
  isdropDown = true

  allowScrolling = true
  dataSource: any[] = []

  constructor(dragulaService: DragulaService, _snackBar: MatSnackBar, _bmxService: BmxService, public deviceService: DeviceDetectorService) {
    super(dragulaService, _snackBar, _bmxService, deviceService)
  }

  ngOnInit(): void {
    this.showDialog = false

    this.rankingScaleValue = this.bmxItem.componentSettings[0].selectedRanking
    this.createRatingStars(this.rankingScaleValue)
    // this.rankingTableType( this.bmxItem.componentSettings[0].rankType)
    this.rankingType = this.bmxItem.componentSettings[0].rankType
    this.rankingType = 'dinamycRadio' //HARD CODE

    this.rowsCount = this.bmxItem.componentText.length - 1;

    this.bmxItem.componentSettings[0].minRule = this.bmxItem.componentSettings[0].minRule > 0 ? this.bmxItem.componentSettings[0].minRule : this.bmxItem.componentText.length-1;
    this.bmxItem.componentSettings[0].maxRule = this.bmxItem.componentSettings[0].maxRule > 0 ? this.bmxItem.componentSettings[0].maxRule : this.bmxItem.componentText.length-1;
    if (this.rankingType == 'dropDown') {
      this.draggableBag = ''
      this.isdropDown = true
    } else if (this.rankingType == 'dragAndDrop') {
      this.draggableBag = 'DRAGGABLE_RANK_ROW'
      this.isdropDown = false

    } else if (this.rankingType == 'radio' || this.rankingType == 'dinamycRadio') {
      this.draggableBag = ''
      this.isdropDown = false
      this.radioColumnCounter = 1
    }

    // COLUMN NAMES
    let values = Object.keys(this.bmxItem.componentText[0])

    values.forEach(value => {
      if (typeof value == "string" && value != "STARS" && value != "CRITERIA" && value != 'RATE') {
        this.columnsNames.push(value)
      }
    });
    //this.columnsNames.push("RadioColumn4", "RadioColumn5");//HARD CODE

    let result = '';

    // Obtener las claves de la primera fila (los nombres de las propiedades)
    let firstObject = this.bmxItem.componentText[0];
    let columnNames = [];
    for (let key in firstObject) {
      if (key === 'Name Candidates' || key === 'Rationales') {
        columnNames.push(key);
      }
    }
    // Agregar cada objeto como una fila en el resultado
    for (let obj of this.bmxItem.componentText) {
      let values = [];
      for (let key in obj) {

        if (key !== 'STARS' && key !== 'RATE' && key !== 'CRITERIA' && !key.includes('Comments')) {
          if (isNaN(Number(obj[key]))) {
            values.push(obj[key]);
          }
        }
      }
      if (values.length > 0) {  // Verificar si hay valores para esta fila
        result += values.join('\t') + '\n';  // Agregar la línea al resultado
      }
    }

    this.testNamesInput = result;
    this.randomizeTestNames = this.bmxItem.componentSettings[0].randomizeTestNames


    // HANDLIN SPECIAL REQUEST
    if (this.bmxItem.componentSettings[1]) {
      if (this.bmxItem.componentSettings[1].isImageType && !this.bmxClientPageOverview) {
        this._bmxService.specialDataObservable$.subscribe((arg: any) => {
          this.bmxItem.componentSettings[1].categoryTobeRender = 'Category ' + arg.tesName
        });

      }
    } else {
      this.bmxItem.componentSettings.push({
        isImageType: false,
        categoryTobeRender: '',
        isSpecialRquest: false,
      })
    }

    if (this.bmxItem.componentSettings[0]['displaySound'] == true) {
      this.displaySound = true;
    }
    const filteredCriteria = this.CRITERIA.filter(criteriaItem => this.selectedCriteria.map(item => item.name).includes(criteriaItem.name));
    this.newselectedCriteria = filteredCriteria
    this.rankingScaleValue = this.bmxItem.componentText[0].STARS.length;
    this.dataSource = this.bmxItem.componentText.slice(1)
  }

  checkDragEvetn(event: CdkDragDrop<string[]>) {
    if (this.bmxItem.componentSettings[0].rankType == 'dragAndDrop') {
      moveItemInArray(this.bmxItem.componentText, event.previousIndex, event.currentIndex);
      this.bmxItem.componentText.forEach((row, rowIndex) => {
        if (rowIndex > 0) {
          row.RATE = rowIndex
        }
      })
    }
    this.autoSave.emit()
  }

  createRatingStars(ratingScale, ratingScaleIcon?) {
    let startCounter: any = []
    for (let index = 0; index < ratingScale; index++) {
      startCounter.push({
        id: index,
        icon: index + 1,
        styleClass: 'rating-star'
      });
    }
    return startCounter;
  }
  
  upLoadNamesAndRationales(list: string, type?: any) {
    this.dragRows = true;
    console.log(this.bmxItem.componentText)
    this.bmxItem.componentSettings[0].randomizeTestNames = (this.randomizeTestNames) ? true : false
    if (!list) { list = this.listString; }
    if (list) {
      this.showBar = true
      this.listString = list;
      const rows = list.split("\n");
      if (type) {
        this.rankingScaleValue = rows.length - 1
      }
      this.columnsNames = [];
      this.columnsNames = rows[0].toLowerCase().split("\t");

      let nameCandidatesCounter = 0
      this.extraColumnCounter = 1
      // COLUMNS NAMES CHECK
      this.columnsNames.forEach((column, index) => {
        column = column.toLowerCase()
        if (nameCandidatesCounter == 0 && column.includes('candidates') || column == 'questions') {
          this.columnsNames[index] = 'nameCandidates'
          nameCandidatesCounter++
        } else
          if (column == 'name rationale' || column == 'rationale' || column == 'rationales') {
            this.columnsNames[index] = 'rationale'
          }
          else if (column == 'katakana') {
            this.columnsNames[index] = 'katakana'
          }
          else {
            if (this.bmxItem.componentSettings[0].rankType != 'radio' || this.bmxItem.componentSettings[0].rankType != 'dinamycRadio') {
              this.columnsNames[index] = 'ExtraColumn' + this.extraColumnCounter
              this.extraColumnCounter++
            }
          }
      });
      this.TESTNAMES_LIST = [];
      let index = 0;
      for (const element of rows) {

        if (element != "" && element.length > 6) {
          let objectColumnDesign = {};
          if (this.ASSIGNED_CRITERIA.length > 0) {

            for (let e = 0; e < this.columnsNames.length; e++) {
              if ((element.split("\t").length > 0)) {
                objectColumnDesign[this.columnsNames[e]] = element.split("\t")[e]
              }
            }
            objectColumnDesign['CRITERIA'] = []
            this.ASSIGNED_CRITERIA.forEach(criteria => {
              objectColumnDesign['CRITERIA'].push({
                name: criteria.name,
                STARS: this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon),
                RATE: -1,
              })
            });
          } else {
            console.log(element)
            for (const key in this.bmxItem.componentText[1]) {
              if (this.bmxItem.componentText[1].hasOwnProperty(key) && key.startsWith("Comments")) {
                // Obtiene el número de la propiedad de comentarios
                const num = key.replace("Comments", "");
                // Agrega la propiedad de comentarios al arreglo this.columnsNames
                objectColumnDesign[key] = "";
              }
            }
            for (const key in objectColumnDesign) {
              if (objectColumnDesign.hasOwnProperty(key) && key.startsWith("Comments")) {
                // Obtiene el número de la propiedad de comentarios
                // Agrega la propiedad de comentarios al arreglo this.columnsNames
                this.columnsNames.push(key)
              }
            }
            objectColumnDesign['STARS'] = this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon);
            for (let e = 0; e < this.columnsNames.length; e++) {
              if ((element.split("\t").length > 0)) {
                objectColumnDesign[this.columnsNames[e]] = element.split("\t")[e]
              }
            }
          }
          const newObj = {};

          // Copia las propiedades que no contienen "Comments"
          for (const key in objectColumnDesign) {
            if (objectColumnDesign.hasOwnProperty(key) && !key.includes("Comments")) {
              newObj[key] = objectColumnDesign[key];
            }
          }

          // Copia las propiedades que contienen "Comments"
          for (const key in objectColumnDesign) {
            if (objectColumnDesign.hasOwnProperty(key) && key.includes("Comments")) {
              index == 0? newObj[key] = 'Comments': newObj[key] = '';
             
            }
          }
          this.TESTNAMES_LIST.push(newObj);
          index++
        }
      }
      this.bmxItem.componentText = this.deleteDuplicates(this.TESTNAMES_LIST, 'nameCandidates');
      this.columnsNames.push('RATE')
      this.dataSource = this.bmxItem.componentText.slice(1)
    } else {
      this.bmxItem.componentText.forEach((row, index) => {
        row.STARS = this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon)
      });
    }
    setTimeout(() => {
      if (this.bmxItem.componentSettings[0].rankType == 'radio' || this.bmxItem.componentSettings[0].rankType == 'dinamycRadio') {
        this.rowsCount = this.bmxItem.componentText.length - 1;
      } else {
        this.rowsCount = this.bmxItem.componentText.length - 1;
      }
      if (this.newSet) {
        this.bmxItem.componentSettings[0].minRule = this.rowsCount;
        this.bmxItem.componentSettings[0].maxRule = this.rowsCount;
        this.newSet = false;
      }

      if (this.bmxItem.componentSettings[0].CRITERIA) {
        //MULTIPLY FOR THE AMOUNT OF CRITERIA
        this.bmxItem.componentSettings[0].minRule = this.bmxItem.componentSettings[0].minRule * this.bmxItem.componentText[0].CRITERIA.length
      }
      this.dragRows = false;
    }, 1000);

    this.rankingTableType(this.bmxItem.componentSettings[0].rankType)
    setTimeout(() => {
      this.dragRows = false;
    }, 1000);

    this.bmxItem.componentSettings[0].selectedRanking = this.rankingScaleValue
    console.log(this.bmxItem.componentText)
  }

  rankingTableType(rankingType) {
    this.bmxItem.componentSettings[0].rankType = rankingType
    let values = Object.keys(this.bmxItem.componentText[0])
    this.columnsNames = []
    this.RadioColumnList = []
    values.forEach(value => {
      if (typeof value == "string" && value != "STARS" && value != "CRITERIA" && value != "RATE") {
        this.columnsNames.push(value)
      }
    });
    this.columnsNames.forEach(columnName => {
      if (columnName.includes('RadioColumn')) {
        this.deleteColumn(columnName)
      }
    });
    if (rankingType == 'dropDown') {
      this.bmxItem.componentSettings[0].rateWidth = 120
      this.draggableBag = ''
      this.isdropDown = true
    } else if (rankingType == 'dragAndDrop') {
      this.bmxItem.componentSettings[0].rateWidth = 80
      this.draggableBag = 'DRAGGABLE_RANK_ROW'
      this.isdropDown = false

    } else if (rankingType == 'radio' || rankingType == 'dinamycRadio') {
      this.bmxItem.componentSettings[0].rateWidth = 80
      this.draggableBag = ''
      this.isdropDown = false
      this.radioColumnCounter = 1
      this.rowsCount = this.bmxItem.componentText.length - 1;
      for (let index = 0; index < this.rankingScaleValue; index++) {
        this.insertRadioColumn()
      }
    }
  }


  toggleScrolling() {
    this.allowScrolling = !this.allowScrolling
    if (this.allowScrolling) {
      window.onscroll = function () { };
    } else {
      var x = window.scrollX;
      var y = window.scrollY;
      window.onscroll = function () { window.scrollTo(x, y); };
    }

  }

  ASSIGNED_CRITERIA = []


}