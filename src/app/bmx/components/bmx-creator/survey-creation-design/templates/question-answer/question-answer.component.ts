import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { DragulaService } from 'ng2-dragula';
import { RatingScaleComponent } from '../rating-scale/rating-scale.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BmxService } from '../../../bmx.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { isNamespaceExport } from 'typescript';

@Component({
  selector: 'app-question-answer',
  templateUrl: './question-answer.component.html',
  styleUrls: ['./question-answer.component.scss']
})
export class QuestionAnswerComponent extends RatingScaleComponent implements OnInit {
  @Input() bmxItem;
  @Input() i;
  @Input() bmxClientPageDesignMode;
  @Input() bmxClientPageOverview;
  @Output() autoSave = new EventEmitter();
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  CREATION_VIDEO_PATH = "assets/videos/QuestionAndAnswer.mp4"
  dataSource: any[] = []
  draggableBag
  isdropDown = false
  allComplete: boolean = false;
  constructor(dragulaService: DragulaService, _snackBar: MatSnackBar, _bmxService: BmxService, public deviceService: DeviceDetectorService) {
    super(dragulaService, _snackBar, _bmxService, deviceService);
  }

  ngOnInit(): void {
    this.showDialog = false

    // COLUMN NAMES
    let values = Object.keys(this.bmxItem.componentText[0])
    values.forEach(value => {
      if (typeof value == "string" && value != "STARS" && value != "CRITERIA") {
        this.columnsNames.push(value)
      }
    });

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
        if (key !== 'STARS' && key !== 'RATE' && key !== 'CRITERIA' && key !== 'Comments') {
          values.push(obj[key]);
        }
      }
      if (values.length > 0) {  // Verificar si hay valores para esta fila
        result += values.join('\t') + '\n';  // Agregar la línea al resultado
      }
    }
    this.testNamesInput = result;
    this.randomizeTestNames = this.bmxItem.componentSettings[0].randomizeTestNames
    this.rowsCount = this.bmxItem.componentText.length - 1;

    this.dataSource = this.bmxItem.componentText.slice(1)
    this.rankingType = this.bmxItem.componentSettings[0].rankType
  }
  veryfy(values: any, name: any) {
    if (typeof values == 'string' && values.split(',')) {
      values=values.replace(/-1/g, "")
      const findedValue = values.split(',').find((value: any) => value == name)
      if (findedValue) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }
  upLoadNamesAndRationales(list: string) {
    this.bmxItem.componentSettings[0].randomizeTestNames = (this.randomizeTestNames) ? true : false
    if (!list) { list = this.listString; }
    if (list) {
      this.listString = list;
      const rows = list.split("\n");
      this.columnsNames = [];
      this.columnsNames = rows[0].toLowerCase().split("\t");
      this.extraColumnCounter = 1
      this.columnsNames.forEach((column, index) => {
        if (column == 'name candidates' || column == 'test names' || column == 'names' || column == 'questions') {
          this.columnsNames[index] = 'nameCandidates'
        } else if (column == 'name rationale' || column == 'rationale' || column == 'rationales') {
          this.columnsNames[index] = 'rationale'
        } else if (column == 'katakana') {
          this.columnsNames[index] = 'katakana'
        } else if (column == 'options') {
          this.columnsNames[index] = 'options'
        }
      });
      this.TESTNAMES_LIST = [];
      for (let i = 0; i < rows.length; i++) {
        if (rows[i] != "" && rows[i].length > 6) {
          let objectColumnDesign = {};
          if (this.ASSIGNED_CRITERIA.length > 0) {//NO APLICA
            this.bmxItem.componentSettings[0].CRITERIA = true
            for (let e = 0; e < this.columnsNames.length; e++) {
              if ((rows[i].split("\t").length > 0)) {
                objectColumnDesign[this.columnsNames[e]] = rows[i].split("\t")[e]
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
          }//NOT CRITERIA
          else {
            this.bmxItem.componentSettings[0].CRITERIA = false
            // objectColumnDesign['STARS'] = this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon);
            for (let e = 0; e < this.columnsNames.length; e++) {
              if ((rows[i].split("\t").length > 0)) {
                objectColumnDesign[this.columnsNames[e]] = rows[i].split("\t")[e]
                // objectColumnDesign[this.columnsNames[e]] = 'multipleChoice'
              }
            }
          }

          this.TESTNAMES_LIST.push(objectColumnDesign);
        }
      }
      this.bmxItem.componentText = this.TESTNAMES_LIST;
    } else {
      // this.bmxItem.componentText.forEach((row, index) => {
      //   row.STARS = this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon)
      //   row.RATE = -1
      //   // this.leaveStar(index);
      // });
    }
  }

  saveMultipleChoice(checkBoxName, indexRow, value) {
    if (this.rankingType == 'radio') {

      if (this.bmxItem.componentText[indexRow]['RATE'] == checkBoxName) {
        this.bmxItem.componentText[indexRow]['RATE'] = ''
      } else {
        if (value.target.checked) {

          this.bmxItem.componentText[indexRow]['RATE'] = (!this.bmxItem.componentText[indexRow]['RATE']) ? checkBoxName : this.bmxItem.componentText[indexRow]['RATE'] = checkBoxName
        } else {
          this.bmxItem.componentText[indexRow]['RATE'] = this.bmxItem.componentText[indexRow]['RATE'].replace(checkBoxName, '')
        }
      }
    } else {
      if (value.target.checked) {
        this.bmxItem.componentText[indexRow]['RATE'] = (!this.bmxItem.componentText[indexRow]['RATE']) ? (checkBoxName + ',').replace(/-1/g, "") : this.bmxItem.componentText[indexRow]['RATE'] += (checkBoxName + ',').replace(/-1/g, "") 
      } else {
        this.bmxItem.componentText[indexRow]['RATE'] = this.bmxItem.componentText[indexRow]['RATE'].replace(checkBoxName + ',', '')
      }
    }
  }

  insertAnswerColumn() {
    this.commentColumnCounter = 0
    this.columnsNames.forEach(columnName => {
      if (columnName.includes('Answers')) {
        this.commentColumnCounter++
        // this.RadioColumnList.push('RadioColumn' + this.commentColumnCounter)
      }
    });
    this.columnsNames.push('Answers' + (this.commentColumnCounter));
    this.bmxItem.componentText.forEach((object, index) => {
      let coulmnName = 'Answers' + this.commentColumnCounter
      if (index > 0) {
        object[coulmnName] = ''
      } else {
        object[coulmnName] = 'Answers'
      }
    });
    // this.commentColumnCounter++
  }

  autosaveAnswer(event: any) {
    this.autoSave.emit();
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

    }
  }


}
