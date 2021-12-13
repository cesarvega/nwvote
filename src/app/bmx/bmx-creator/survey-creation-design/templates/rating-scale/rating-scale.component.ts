import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { DragulaService } from 'ng2-dragula';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-rating-scale',
  templateUrl: './rating-scale.component.html',
  styleUrls: ['./rating-scale.component.scss']
})
export class RatingScaleComponent implements OnInit {

  @Input() bmxItem;
  @Input() i;
  @Input() bmxClientPageDesignMode;
  @Input() bmxClientPageOverview;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  rankingScaleValue = 5;
  selectedRowCounter = 0;
  selectedIndex: any = ''
  displayInstructions = false;

  selectedStarRatingIndex = ''
  selectedRating: any;

  // columnsSlider = 150
  // rowHeightSlider = 2
  // fontSizeRow = 19
  // rationalewidth = this.columnsSlider + 100


  // CONFIGURATION VARIABLES
  testNamesInput: string
  TestNameDataModel: any[];
  ratingScale = 5;
  TESTNAMES_LIST = [];
  columnsNames = [];
  columnsNamesHeader: string[];
  listString: string;
  tempItems = [];
  selectedColumn
  ratingScaleIcon = 'grade';
  selectedCriteria
  newCriteria = ''
  extraColumnCounter = 1
  radioColumnCounter = 1
  commentColumnCounter = 1
  rankingType = 'dropDown'
  RadioColumnList = []
  selectedCard: any

  minRuleCounter = 0
  maxRuleCounter = 0
  deleteRows = false
  dragRows = false;
  isColumnResizerOn = false;
  editSingleTableCells = false

  BAG = "DRAGGABLE_ROW";
  subs = new Subscription();
  rowsCount = 10
  constructor(private dragulaService: DragulaService, private _snackBar: MatSnackBar) {
    //   dragulaService.createGroup('DRAGGABLE_ROW', {
    //     moves: (el, container, handle, sibling) => {
    //       if (el.classList.contains('ROW-CERO')) {
    //         return false
    //       }else return true
    //     }
    // });

    // dragulaService.createGroup("DRAGGABLE_ROW", {
    //   removeOnSpill: true
    // });

  }
  ngOnInit(): void {
    // COLUMN NAMES
    let values = Object.keys(this.bmxItem.componentText[0])

    values.forEach(value => {
      if (typeof value == "string" && value != "STARS" && value != "CRITERIA") {
        this.columnsNames.push(value)
      }
    });
    // this.columnsNames.push('RATE')

    if (this.bmxItem.componentSettings[0].CRITERIA) {
      this.bmxItem.componentText.forEach((item, index) => {
        if (index == 0) {
        }
      })
    }
    // this.selectedCriteria = 'Fit to Compound Concept, and Overall Likeability'
  }

  maxRuleCounterMinus() {
    if (this.maxRuleCounter != 0) {
      this.maxRuleCounter--;
    }
    if (this.bmxItem.componentSettings[0].ratedCounter > 0) {
      this.bmxItem.componentSettings[0].ratedCounter--;
    }

    if (this.bmxItem.componentSettings[0].ratedCounter >= this.bmxItem.componentSettings[0].minRule) {
      this.bmxItem.componentSettings[0].categoryRulesPassed = true
    } else { this.bmxItem.componentSettings[0].categoryRulesPassed = false }
  }
  // ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️ STARS METHODS  ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️
  setRating(rate, testNameId) {
    if (rate.target && this.bmxItem.componentType == 'narrow-down') {
      if (this.selectedRowCounter >= this.rankingScaleValue && !this.bmxItem.componentText[testNameId].SELECTED_ROW) {

        for (let index = 0; index < this.bmxItem.componentText.length; index++) {
          // REMOVE FIRST CHECKED VALUE
          if (this.bmxItem.componentText[index].SELECTED_ROW) {
            // ASK BEFROE REMOVE IT 
            this._snackBar.open(this.bmxItem.componentText[index].nameCandidates + ' was uncheck', 'OK', {
              duration: 4000,
              verticalPosition: 'bottom',
            }).afterDismissed().subscribe(action => { })

            this.bmxItem.componentText[index].SELECTED_ROW = false;
            break
          }
        }
      }
      else {
        if (this.bmxItem.componentText[testNameId]["CRITERIA"]) {
          this.bmxItem.componentText[testNameId]["CRITERIA"].forEach(criteria => {
            criteria.RATE = 0
          });
        } else {
          this.bmxItem.componentText[testNameId]["RATE"] = 0
        }
      }

      this.bmxItem.componentText[testNameId].SELECTED_ROW = rate.target.checked
      this.selectedRowCounter = 0
      for (let index = 0; index < this.bmxItem.componentText.length; index++) {
        if (this.bmxItem.componentText[index].SELECTED_ROW) {
          this.selectedRowCounter++
        }
        //  else {
        //   // this.bmxItem.componentText[index].SELECTED_ROW = false
        // }
      }
    }

    if (this.bmxItem.componentType == 'ranking-scale') {


      this.bmxItem.componentText.forEach((testnameRow, i) => {
        if (testnameRow.RATE == rate) {
          this.bmxItem.componentText[i].RATE = 0
          // ASK BEFROE REMOVE IT 
          // this._snackBar.open(testnameRow.nameCandidates + 'was already rank ' + rate, 'ok', {
          //   duration: 4000,
          //   verticalPosition: 'bottom',
          // })
        }
      });
      this.bmxItem.componentText[testNameId].RATE = rate


    }

    else {
      if (this.maxRuleCounter < this.bmxItem.componentSettings[0].maxRule || this.bmxItem.componentSettings[0].maxRule == 0) {
        if (this.bmxItem.componentSettings[0].maxRule > 0) { this.maxRuleCounter++ }
        this.bmxItem.componentText[testNameId].RATE = rate
        this.bmxItem.componentSettings[0].ratedCounter++
        if (this.bmxItem.componentSettings[0].ratedCounter >= this.bmxItem.componentSettings[0].minRule) {
          this.bmxItem.componentSettings[0].categoryRulesPassed = true
        } else { this.bmxItem.componentSettings[0].categoryRulesPassed = false }
      } else {
        if (this.bmxItem.componentType != 'narrow-down' && this.bmxItem.componentSettings[0].maxRule > 0) {
          this._snackBar.open('you can only rate up to ' + this.bmxItem.componentSettings[0].maxRule + ' Test Names', 'OK', {
            duration: 5000,
            verticalPosition: 'top',
          })
        }
      }
    }
  }

  selectStar(starId, testNameId): void {
    this.bmxItem.componentText[testNameId].STARS.filter((star) => {
      if (star.id <= starId) {

        star.styleClass = (this.ratingScaleIcon === 'grade') ? 'active-rating-star' : 'active-rating-bar';

      } else {

        star.styleClass = 'rating-star';

      }
      return star;
    });
  }

  leaveStar(testNameId): void {
    if (this.bmxItem.componentText[testNameId].CRITERIA) {
      this.bmxItem.componentText[testNameId].CRITERIA.forEach((criteria, index) => {
        this.leaveCriteriaStar(testNameId, index)
      });
    } else {
      this.selectedRating = this.bmxItem.componentText[testNameId].RATE
      this.bmxItem.componentText[testNameId].STARS.filter((star) => {
        if (star.id <= this.selectedRating && this.selectedRating !== "") {
          star.styleClass = (this.ratingScaleIcon === 'grade') ? 'active-rating-star' : 'active-rating-bar';
        } else {
          star.styleClass = 'rating-star';
        }
        return star;
      });
    }

  }

  // CRITERIA STARS

  setCriteriaRating(starId, criteriaId, testNameId) {
    this.bmxItem.componentText[testNameId].CRITERIA[criteriaId].RATE = starId
  }

  selectCriteriaStar(starId, criteriaId, testNameId): void {
    this.bmxItem.componentText[testNameId].CRITERIA[criteriaId].STARS.filter((star) => {
      if (star.id <= starId) {

        star.styleClass = (this.ratingScaleIcon === 'grade') ? 'active-rating-star' : 'active-rating-bar';

      } else {

        star.styleClass = 'rating-star';

      }
      return star;
    });
  }

  leaveCriteriaStar(testNameId, criteriaId): void {

    this.selectedRating = this.bmxItem.componentText[testNameId].CRITERIA[criteriaId].RATE
    this.bmxItem.componentText[testNameId].CRITERIA[criteriaId].STARS.filter((star) => {
      if (star.id <= this.selectedRating && this.selectedRating !== "") {
        star.styleClass = (this.ratingScaleIcon === 'grade') ? 'active-rating-star' : 'active-rating-bar';
      } else {
        star.styleClass = 'rating-star';
      }
      return star;
    });
  }

  createRatingStars(ratingScale, ratingScaleIcon) {
    let startCounter: any = []
    for (let index = 1; index <= ratingScale; index++) {
      startCounter.push({
        id: index,
        icon: ratingScaleIcon,
        styleClass: 'rating-star'
      });
    }
    return startCounter;
  }
  // ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️ END STARS METHODS  ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️


  upLoadNamesAndRationales(list: string) {
    this.dragRows = true;
    if (!list) { list = this.listString; }
    if (list) {
      this.listString = list;
      const rows = list.split("\n");
      this.columnsNames = [];
      this.columnsNames = rows[0].toLowerCase().split("\t");

      let nameCandidatesCounter = 0
      this.extraColumnCounter = 1
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
            this.columnsNames[index] = 'ExtraColumn' + this.extraColumnCounter
            this.extraColumnCounter++
          }
      });

      this.TESTNAMES_LIST = [];
      for (let i = 0; i < rows.length; i++) {
        if (rows[i] != "" && rows[i].length > 6) {
          let objectColumnDesign = {};
          if (this.ASSIGNED_CRITERIA.length > 0) {// CRITERIA
            this.bmxItem.componentSettings[0].CRITERIA = true
            for (let e = 0; e < this.columnsNames.length; e++) {
              if ((rows[i].split("\t").length > 0)) {
                objectColumnDesign[this.columnsNames[e]] = rows[i].split("\t")[e].trim()
              }
            }
            objectColumnDesign['CRITERIA'] = []
            this.ASSIGNED_CRITERIA.forEach((criteria, index) => {
              objectColumnDesign['CRITERIA'].push({
                name: criteria.name,
                STARS: this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon),
                RATE: index > 0 ? -1 : 'RATE',
              })
            });
          } else {
            this.bmxItem.componentSettings[0].CRITERIA = false
            objectColumnDesign['STARS'] = this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon);
            objectColumnDesign['RATE'] = i > 0 ? -1 : 'RATE'
            for (let e = 0; e < this.columnsNames.length; e++) {
              if ((rows[i].split("\t").length > 0)) {
                objectColumnDesign[this.columnsNames[e]] = rows[i].split("\t")[e].trim()

              }
            }
          }
          this.TESTNAMES_LIST.push(objectColumnDesign);
        }
      }
      this.bmxItem.componentText = this.deleteDuplicates(this.TESTNAMES_LIST, 'nameCandidates');
      this.columnsNames.push('RATE')
    } else {
      if (this.ASSIGNED_CRITERIA.length > 0) {
        this.bmxItem.componentSettings[0].CRITERIA = true
        this.bmxItem.componentText.forEach((row, index) => {
          let CRITERIA = [];
          this.ASSIGNED_CRITERIA.forEach(criteria => {
            CRITERIA.push({
              name: criteria.name,
              STARS: this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon),
              RATE: index > 0 ? -1 : 'RATE',
            })
          });
          row.CRITERIA = CRITERIA
          delete row["'STARS'"];
        });
      }
      else {
        this.bmxItem.componentSettings[0].CRITERIA = false
        this.bmxItem.componentText.forEach((row, index) => {
          row.STARS = this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon)
          row.RATE = index > 0 ? -1 : 'RATE',
            delete row['CRITERIA'];
          // this.leaveStar(index);
        });
      }
    }
    setTimeout(() => {
      this.dragRows = false;
    }, 1000);
  }

  // delete row diplicates from array of object by property
  deleteDuplicates(array, property) {
    let newArray = [];
    let lookupObject = {};

    for (let i in array) {
      lookupObject[array[i][property]] = array[i];
    }

    for (let i in lookupObject) {
      newArray.push(lookupObject[i]);
    }

    if (array.length > newArray.length) {
      const unionMinusInter = this.unionMinusIntersection(array, newArray)
      const nameCandidates = this.spreadArray(unionMinusInter)
      this._snackBar.open(`You have  ${array.length - newArray.length} duplicates removed: "${nameCandidates.join(', ')}" 🍕`, 'OK', {
        duration: 10000,
        verticalPosition: 'top',
      })
    }
    return newArray;
  }
  // remove objects from array1 that are also in array2
  unionMinusIntersection(array1, array2) {
    let union = array1.concat(array2);
    let intersection = array1.filter(x => array2.includes(x));
    let unionMinusInter = union.filter(x => !intersection.includes(x));
    return unionMinusInter;
  }
  //  spread array of object to array of string by property
  spreadArray(array) {
    let newArray = [];
    array.forEach(element => {
      newArray.push(element.nameCandidates)
    });
    return newArray;
  }

  // COLUMNS ADD AND REMOVE
  insertTextColumn() {
    this.columnsNames.push('ExtraColumn' + (this.extraColumnCounter));
    this.bmxItem.componentText.forEach((object) => {
      let coulmnName = 'ExtraColumn' + this.extraColumnCounter
      object[coulmnName] = 'Text Column'
    });
    this.extraColumnCounter++
  }

  insertCommentBoxColumn() {
    this.columnsNames.forEach(columnName => {
      if (columnName.includes('Comments')) {
        this.commentColumnCounter++
        // this.RadioColumnList.push('RadioColumn' + this.commentColumnCounter)
      }
    });
    this.columnsNames.push('Comments' + (this.commentColumnCounter));
    this.bmxItem.componentText.forEach((object, index) => {
      let coulmnName = 'Comments' + this.commentColumnCounter
      if (index > 0) {
        object[coulmnName] = ''
      } else {
        object[coulmnName] = 'General Comments'
      }
    });
    this.commentColumnCounter++
  }

  insertRadioColumn() {
    this.columnsNames.push('RadioColumn' + (this.radioColumnCounter));
    this.bmxItem.componentText.forEach((object, index) => {
      let coulmnName = 'RadioColumn' + this.radioColumnCounter
      if (index == 0) {
        object[coulmnName] = this.radioColumnCounter
      } else {
        object[coulmnName] = false
      }
    });
    this.radioColumnCounter++
  }

  saveRadioColumValue(name, y) {
    this.RadioColumnList = []
    let values = Object.keys(this.bmxItem.componentText[y])
    values.forEach(columnName => {
      if (columnName.includes('RadioColumn')) {
        this.bmxItem.componentText[y][columnName] = false
      }

      if (columnName.includes('RadioColumn')) {
        this.RadioColumnList.push(columnName)
      }
    });
    this.bmxItem.componentText[y][name] = true
    this.RadioColumnList.forEach((columnName, index) => {
      // if (columnName.includes('RadioColumn')) {
      if (this.bmxItem.componentText[y][columnName]) {
        if (this.bmxItem.componentType == 'ranking-scale' || true) {
          this.bmxItem.componentText.forEach((element, i) => {
            if (element.RATE == index + 1) {
              this.bmxItem.componentText[i].RATE = 0
              this.RadioColumnList.forEach(radioColumnName => {
                this.bmxItem.componentText[i][radioColumnName] = false
              });
            }
          });
        }
        this.bmxItem.componentText[y].RATE = index + 1
      }
      // }
    });
  }

  deletRow(option): void {
    if (confirm('Are you sure you want to delete this row?')) {
      this.bmxItem.componentText.splice(option, 1);
    }
  }

  insertRow(): void {
    const newRow = Object.assign({}, this.bmxItem.componentText[0]);
    this.bmxItem.componentText.push(newRow)
  }

  swapColumns(index): void {
    let temp = this.columnsNames[index];
    // update columnsNames array order
    for (let i = index; i < this.columnsNames.length - 1; i++) {
      this.columnsNames[i] = this.columnsNames[i + 1];
    }
    this.columnsNames[this.columnsNames.length - 1] = temp;
    let newRow = {}
    // re-order brand matrix columns
    this.bmxItem.componentText.forEach((row, rowIndex) => {
      for (let i = 0; i < this.columnsNames.length - 1; i++) {
        Object.keys(row).forEach(key => {
          if (this.columnsNames[i] == key) {
            newRow[key] = row[key]
          }
        })
      }
      this.bmxItem.componentText[rowIndex] = this.mergeObjects(newRow, row)
    });
  }

  mergeObjects(obj1, obj2) {
    let obj3 = {};
    for (let attrname in obj1) {
      obj3[attrname] = obj1[attrname];
    }
    for (let attrname in obj2) {
      obj3[attrname] = obj2[attrname];
    }
    return obj3;
  }

  deleteColumn(columnName) {
    if (confirm('Are you sure you want to delete ' + columnName + ' column?')) {
      let temporary = []
      // REMOVE THE COLUMN FROM THE COLUMNS
      this.columnsNames.forEach((element, index) => {
        if (element !== columnName) {
          temporary.push(element)
          if (element.includes('Comments')) {
            // this.RadioColumnList['RadioColumn' + this.commentColumnCounter] = undefined
            this.commentColumnCounter--
          }
        }
      });
      this.columnsNames = temporary;
      this.bmxItem.componentText.forEach((object, index) => {
        delete this.bmxItem.componentText[index][columnName]
      });
      this.bmxItem.componentText = this.bmxItem.componentText;
    }
  }

  criteriaSelection(selectedCriteria) {
    this.ASSIGNED_CRITERIA = selectedCriteria
  }



  addCriteria(newCriteria) {
    if (newCriteria.length > 0) {
      this.CRITERIA.unshift({ name: newCriteria })
    }
  }
  deleteCriteria(index) {
    if (confirm('Are you sure you want to delete criteria?')) {
      this.CRITERIA.splice(index, 1)
    }
  }

  checkDragEvetn(e) {
    // console.log(e);
  }

  toogleColumnResizer() {
    this.isColumnResizerOn = !this.isColumnResizerOn
  }


  onPaste() {
    setTimeout(() => {
      let rows = this.testNamesInput.split("\n");
      this.rowsCount = rows.length - 1
    }, 1000);
  }

  ASSIGNED_CRITERIA = []
  CRITERIA = [
    { name: 'Fit to Compound Concept' },
    { name: 'Fit to Corporate Mission' },
    { name: 'Overall Likeability' },
  ]

}
