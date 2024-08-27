import { Component, ElementRef, EventEmitter, HostListener, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { DragulaService } from 'ng2-dragula';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import * as  dragula from 'dragula';
import { BmxService } from '../../../bmx.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Console } from 'console';

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
  @Output() autoSave = new EventEmitter();
  rankingScaleValue = 5;
  selectedRowCounter = 0;
  selectedIndex: any = ''
  displayInstructions = false;

  selectedStarRatingIndex = ''
  selectedRating: any;
  uploadImagesIcon = false
  // columnsSlider = 150
  // rowHeightSlider = 2
  // fontSizeRow = 19
  // rationalewidth = this.columnsSlider + 100


  // CONFIGURATION VARIABLES
  testNamesInput: string
  TestNameDataModel: any[];
  ratingScale = 5;
  numRatingScale: number = 5;
  TESTNAMES_LIST = [];
  columnsNames:any = [];
  columnsNamesHeader: string[];
  listString: string;
  tempItems = [];
  selectedColumn
  ratingScaleIcon = 'grade';
  selectedCriteria: any[] = []
  newCriteria = ''
  extraColumnCounter = 1
  radioColumnCounter = 1
  commentColumnCounter = 1
  rankingType = 'dropDown'
  RadioColumnList = []
  selectedCard: any
  newSet: boolean = false;
  minRuleCounter = 0
  maxRuleCounter = 0
  deleteRows = false
  dragRows = false;
  isColumnResizerOn = false;
  editSingleTableCells = false

  BAG = "DRAGGABLE_RANK_ROW";
  subs = new Subscription();
  rowsCount = 0

  HISTORY = []
  RANGEARRAY = ['columnWidth1', 'columnWidth2', 'columnWidth3']
  selectedNarrowDownTimer = 0;
  columnFontSize = 15;
  randomizeTestNames = false
  displaySound = false
  showMatrixMenu: boolean = false;
  iconMenuShow: string = "add_circle_outline";
  textToolTip: string = "open menu";
  scroll: any; s
  @ViewChild('modalChecked') modalChecked: MatCheckboxModule | any;

  @Output() launchPathModal = new EventEmitter();
  showModalVideo: boolean = true;
  showCreationModalVideo: boolean = false
  openElements: any[] = [];
  CREATION_VIDEO_PATH = "assets/videos/RateMatrix.mp4"
  //------modal-----------//
  VIDEO_PATH: any[] = [];

  PATH1: any[] = [
    'assets/img/bmx/tutorial/imagen1.JPG',
    'assets/img/bmx/tutorial/imagen2.JPG',
  ]

  PATH2: any[] = [
    'assets/img/bmx/tutorial/img-desktop1.JPG',
    'assets/img/bmx/tutorial/img-desktop2.JPG',
  ]
  deviceInfo = null;
  public isDesktopDevice: any = null;
  showDialog: boolean = false;
  actionType: any;
  dialogText: string;
  templateToDelete: any;
  newselectedCriteria: any;
  showModalTable = false
  displayedColumns: string[] = ['nameCandidates', 'rationale', 'delete'];
  dataSource: any[] = []
  showFileUploader = false
  //----------end modal------//

  constructor(private dragulaService: DragulaService, public _snackBar: MatSnackBar, public _bmxService: BmxService, public deviceService: DeviceDetectorService) {
    // DRAG AND DROP
    let drake = dragula();
    // this.dragulaService.add(this.BAG, drake);

    this.dragulaService.drag(this.BAG)
      .subscribe(({ el }) => {
        console.log('drag' + el);
      })
    this.subs.add(this.dragulaService.drop(this.BAG)
      .subscribe(({ el }) => {
        console.log('drop' + el);
      })
    );
    this.subs.add(this.dragulaService.over(this.BAG)
      .subscribe(({ el, container }) => {

        console.log('over', container);
      })
    );
    this.subs.add(this.dragulaService.out(this.BAG)
      .subscribe(({ el, container }) => {

        console.log('out', container);
      })
    );
  }

  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    this.isDesktopDevice = this.deviceService.isDesktop();
  }


  ngOnInit(): void {
    this.showDialog = false
    // COLUMN NAMES
    this.rankingScaleValue = this.numRatingScale;
    this.rowsCount = this.bmxItem.componentText.length - 1
    if (this.bmxItem.componentSettings[0].CRITERIA) {
      this.numRatingScale = this.bmxItem.componentText[0].CRITERIA[0].STARS.length
    } else {
      this.numRatingScale = this.bmxItem.componentText[0].STARS?.length
    }
    // COLUMN NAMES
    let values = Object.keys(this.bmxItem.componentText[0])

    values.forEach(value => {
      if (typeof value == "string" && value != "STARS" && value != "CRITERIA") {
        this.columnsNames.push(value)
      }
    });

    //this.columnsNames.push("RadioColumn4", "RadioColumn5");//HARD CODE

    let result = '';

    // Obtener las claves de la primera fila (los nombres de las propiedades)
    let firstObject = this.bmxItem.componentText[0];
    let columnNames = [];
    for (let key in firstObject) {
      // if (key === 'Name Candidates' || key === 'Rationales') {
        columnNames.push(key);
      // }
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


    // IF RATING SCALE IS SET
    let amountOfAnswersRateCounter = 0
    this.rankingScaleValue = this.numRatingScale;
    this.bmxItem.componentText.forEach((item, index) => {
      if (index > 0) {
        if (item.RATE > 0) {
          amountOfAnswersRateCounter++
          this.maxRuleCounter++
          if (this.bmxItem.componentText.length - 1 == amountOfAnswersRateCounter) {
            this.bmxItem.componentSettings[0].categoryRulesPassed = true
          }
        }
      }

      // SET THE SURVEY LANGUAGE
      this._bmxService.currentprojectData$.subscribe((projectData: any) => {
        if (projectData.bmxLanguage == 'Japanese') {
          this.bmxItem.componentSettings[0].language = 'Japanese'
        }
      })

    })

    this.bmxItem.componentText.forEach((item, index) => {
      let intValue = 0
      if (item.CRITERIA) {
        if (index > 0) {
          item.CRITERIA.forEach(item => {
            if (item.RATE > 0) {
              intValue = intValue + item.RATE
            }
          })
          if (intValue > 0) {
            this.maxRuleCounter++
          }
        }
      }
    })

    if (this.bmxItem.componentText[0].CRITERIA) {
      const newArray = []
      this.newselectedCriteria = []
      this.bmxItem.componentText[0].CRITERIA.forEach((item, index) => {
        this.selectedCriteria.push(item)
        newArray.push({ name: item.name })

      })
      this.newselectedCriteria = newArray
      this.ASSIGNED_CRITERIA = this.selectedCriteria
    }
    this.randomizeTestNames = this.bmxItem.componentSettings[0].randomizeTestNames

    if (this.bmxItem.componentSettings[0]['displaySound'] == true) {
      this.displaySound = true;
    }

    this.epicFunction();

    // if(this.isDesktopDevice){
    //   this.VIDEO_PATH = this.PATH2;
    // }else{
    //   this.VIDEO_PATH = this.PATH1;
    // }

    this.bmxItem.componentSettings[0].minRule = this.bmxItem.componentSettings[0].minRule > 0 ? this.bmxItem.componentSettings[0].minRule : this.bmxItem.componentText.length-1;
    this.bmxItem.componentSettings[0].maxRule = this.bmxItem.componentSettings[0].maxRule > 0 ? this.bmxItem.componentSettings[0].maxRule : this.bmxItem.componentText.length-1;
    if (window.innerWidth <= 1024) {
      this.VIDEO_PATH = this.PATH1;
    } else {
      this.VIDEO_PATH = this.PATH2;
    }
    const filteredCriteria = this.CRITERIA.filter(criteriaItem => this.selectedCriteria.map(item => item.name).includes(criteriaItem.name));
    this.newselectedCriteria = filteredCriteria
    this.launchPathModal.emit(this.VIDEO_PATH)
    this.dataSource = this.bmxItem.componentText
  }

  openSelected(y: any) {

    if (this.openElements.indexOf(y) === -1) {
      this.openElements.push(y);
    } else {
      this.openElements.splice(this.openElements.indexOf(y), 1);
    }
  }

  open(y: any) {

    if (this.openElements.indexOf(y) == -1) {
      return false;
    } else {
      return true;
    }

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

      if (this.selectedRowCounter >= this.bmxItem.componentSettings[0].maxRule && !this.bmxItem.componentText[testNameId].SELECTED_ROW) {
        this.selectedNarrowDownTimer = 4000
        for (let index = 0; index < this.bmxItem.componentText.length; index++) {
          // REMOVE FIRST CHECKED VALUE
          if (this.bmxItem.componentText[index].SELECTED_ROW) {
            // ASK BEFROE REMOVE IT
            this._snackBar.open(this.bmxItem.componentText[index].nameCandidates + ' was uncheck becuse you can only select up to ' + this.bmxItem.componentSettings[0].maxRule
              + ' test names ', 'OK', {
              duration: 6000,
              verticalPosition: 'top',
            }).afterDismissed().subscribe(action => {

            })
            this.maxRuleCounter = this.maxRuleCounter - 1
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

      if (this.selectedRowCounter == this.bmxItem.componentSettings[0].minRule && !this.bmxClientPageOverview) {
        this.bmxItem.componentSettings[0].categoryRulesPassed = true
        setTimeout(() => {
          this._snackBar.open('Great ' + this.bmxItem.componentSettings[0].minRule
            + ' test names were selected, now rate them', 'OK', {
            duration: 6000,
            verticalPosition: 'bottom',
          }).afterDismissed().subscribe(action => { })
        }, this.selectedNarrowDownTimer);

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
      //autosave
      this.autoSave.emit();
      // HANDLIN SPECIAL REQUEST
      // if (!this.bmxItem.componentSettings[1].isImageType && rate == 1) {
      //   let payload = {
      //     tesName: this.bmxItem.componentText[testNameId].nameCandidates
      //   }
      //   this._bmxService.setSpecialDataObservable(payload)
      // }
    }
    if (!rate.target && this.bmxItem.componentType == 'narrow-down') {
      this.maxRuleCounter = this.maxRuleCounter - 1
    }
    if ((!rate.target && this.bmxItem.componentType == 'narrow-down') || this.bmxItem.componentType != 'narrow-down') {
      if (this.maxRuleCounter < this.bmxItem.componentSettings[0].maxRule || this.bmxItem.componentSettings[0].maxRule == 0) {

        if (this.bmxItem.componentSettings[0].maxRule > 0) { this.maxRuleCounter++ }
        this.bmxItem.componentText[testNameId].RATE = rate
        this.bmxItem.componentSettings[0].ratedCounter++
        if (this.bmxItem.componentSettings[0].ratedCounter >= this.bmxItem.componentSettings[0].minRule) {
          this.bmxItem.componentSettings[0].categoryRulesPassed = true
        } else { this.bmxItem.componentSettings[0].categoryRulesPassed = false }
        //autosave
        this.autoSave.emit();
      } else if (this.maxRuleCounter < this.bmxItem.componentSettings[0].maxRule) {
        this.bmxItem.componentText[testNameId].RATE = rate
        //autosave
        if (this.bmxItem.componentSettings[0].maxRule > 0) { this.maxRuleCounter++ }
        this.autoSave.emit();
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
    let intCounter = 0
    this.bmxItem.componentText[testNameId].CRITERIA.forEach((criteria) => {
      intCounter = intCounter + criteria.RATE
    })
    if (this.maxRuleCounter < this.bmxItem.componentSettings[0].maxRule || this.bmxItem.componentSettings[0].maxRule == 0) {
      intCounter = 0
      if (this.bmxItem.componentSettings[0].maxRule > 0) {

        this.bmxItem.componentText[testNameId].CRITERIA.forEach((criteria) => {
          intCounter = intCounter + criteria.RATE
        })
        if (intCounter <= 0) {
          this.maxRuleCounter++
        }
      }
      this.bmxItem.componentText[testNameId].CRITERIA[criteriaId].RATE = starId

      this.bmxItem.componentSettings[0].ratedCounter++
      if (this.bmxItem.componentSettings[0].ratedCounter >= this.bmxItem.componentSettings[0].minRule) {
        this.bmxItem.componentSettings[0].categoryRulesPassed = true
      }
      else { this.bmxItem.componentSettings[0].categoryRulesPassed = false }
    } else if (intCounter > 0) {
      this.bmxItem.componentText[testNameId].CRITERIA[criteriaId].RATE = starId

      this.bmxItem.componentSettings[0].ratedCounter++
      if (this.bmxItem.componentSettings[0].ratedCounter >= this.bmxItem.componentSettings[0].minRule) {
        this.bmxItem.componentSettings[0].categoryRulesPassed = true
      }
      else { this.bmxItem.componentSettings[0].categoryRulesPassed = false }
    }
    //autosave
    this.autoSave.emit();
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

  upLoadNamesAndRationales(list: any, type?: any) {
    if (typeof list == 'object') {
        list = ''
    }
    this.uploadImagesIcon = true;
    this.bmxItem.componentSettings[0].randomizeTestNames = this.randomizeTestNames ? true : false;
    this.recordHistory();
    this.dragRows = true;
    if (!list) { list = this.listString; }
    if (list) {
        this.listString = list;
        const rows = list.split("\n");

        let nameCandidatesCounter = 0;
        this.extraColumnCounter = 1;

        // COLUMNS NAMES CHECK
        const rateColumnIndex = this.columnsNames.findIndex(column => column === 'RATE');
        if (rateColumnIndex !== -1) {
            this.columnsNames.splice(rateColumnIndex, 1); // Eliminar RATE si ya existe para evitar duplicación
        }

        this.columnsNames.forEach((column, index) => {
            column = column.toLowerCase();
            if (nameCandidatesCounter == 0 && column.includes('candidates') || column == 'questions') {
                nameCandidatesCounter++;
            } else if (column == 'name rationale' || column == 'rationale' || column == 'rationales') {
                // Logic for rationale columns
            } else if (column == 'katakana') {
                // Logic for katakana column
            } else {
                if (this.bmxItem.componentSettings[0].rankType != 'radio' || this.bmxItem.componentSettings[0].rankType != 'dinamycRadio') {
                    this.extraColumnCounter++;
                }
            }
        });

        // Insertar la columna RATE en la posición original
        const originalRatePosition = rateColumnIndex !== -1 ? rateColumnIndex : this.columnsNames.length;
        this.columnsNames.splice(originalRatePosition, 0, 'RATE');

        this.TESTNAMES_LIST = [];
        this.autoSizeColumns('RATE', '', this.rankingScaleValue);

        // TEST NAMES CHECK
        let index = 0;
        for (let i = 0; i < rows.length; i++) {
            if (rows[i] != "" && rows[i].length > 6) {
                let objectColumnDesign = {};
                if (this.ASSIGNED_CRITERIA.length > 0) { // CRITERIA
                    this.bmxItem.componentSettings[0].CRITERIA = true;
                    this.bmxItem.componentSettings[0].rateWidth = (this.bmxItem.componentSettings[0].rateWidth < 220) ? 220 : this.bmxItem.componentSettings[0].rateWidth;

                    for (let e = 0; e < this.columnsNames.length; e++) {
                        if (rows[i].split("\t").length > 0) {
                            const columnName = this.columnsNames[e];
                            let columnValue;
                            if (this.bmxItem.componentText.length > i && columnName == 'nameCandidates') {
                                columnValue = this.bmxItem.componentText[i].nameCandidates == "LOGO" ? this.bmxItem.componentText[i].nameCandidates : rows[i].split("\t")[e].trim();
                            } else {
                                columnValue = rows[i].split("\t")[e] ? rows[i].split("\t")[e].trim() : '';
                            }
                            objectColumnDesign[columnName] = columnValue;
                            if (i != 0) {
                                this.autoSizeColumns(columnName, columnValue);
                            }
                        }
                    }
                    objectColumnDesign['RATE'] = i > 0 ? -1 : 'RATE';
                    objectColumnDesign['CRITERIA'] = [];
                    this.ASSIGNED_CRITERIA.forEach((criteria, index) => {
                        objectColumnDesign['CRITERIA'].push({
                            name: criteria.name,
                            STARS: this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon),
                            RATE: -1,
                        });
                    });
                } else {
                    this.bmxItem.componentSettings[0].CRITERIA = false;
                    objectColumnDesign['STARS'] = this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon);
                    for (let e = 0; e < this.columnsNames.length; e++) {
                        if (rows[i].split("\t").length > 0) {
                            const columnName = this.columnsNames[e];
                            let columnValue;
                            if (this.bmxItem.componentText.length > i && columnName == 'nameCandidates') {
                                columnValue = this.bmxItem.componentText[i].nameCandidates == "LOGO" ? this.bmxItem.componentText[i].nameCandidates : rows[i].split("\t")[e].trim();
                            } else {
                                columnValue = rows[i].split("\t")[e] ? rows[i].split("\t")[e].trim() : '';
                            }
                            objectColumnDesign[columnName] = columnValue;
                            if (i != 0) {
                                this.autoSizeColumns(columnName, columnValue);
                            }
                        }
                    }
                }

                objectColumnDesign['RATE'] = i > 0 ? -1 : 'RATE';
                objectColumnDesign['STARS'] = this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon);
                for (let b = 0; b < this.columnsNames.length; b++) {
                    if (rows[i].split("\t").length > 0 && this.columnsNames[b] !== 'nameCandidates') {
                        objectColumnDesign[this.columnsNames[b]] = rows[i].split("\t")[b];
                    }
                }
                if (this.bmxItem.componentType == 'narrow-down') {
                    objectColumnDesign['SELECTED_ROW'] = false;
                }
                const newObj = {};

                for (const key in this.bmxItem.componentText[1]) {
                    if (this.bmxItem.componentText[1].hasOwnProperty(key) && key.startsWith("Comments")) {
                        objectColumnDesign[key] = "";
                    }
                }

                for (const key in objectColumnDesign) {
                    if (objectColumnDesign.hasOwnProperty(key) && !key.includes("Comments")) {
                        newObj[key] = objectColumnDesign[key];
                    }
                }

                for (const key in objectColumnDesign) {
                    if (objectColumnDesign.hasOwnProperty(key) && key.includes("Comments")) {
                        newObj[key] = index == 0 ? this.bmxItem.componentText[0][key] : '';
                    }
                }

                this.TESTNAMES_LIST.push(newObj);
                index++;
            }
        }

        if (this.ASSIGNED_CRITERIA.length > 0) { // CRITERIA
            this.bmxItem.componentText.forEach((row, index) => {
                let CRITERIA = [];
                this.ASSIGNED_CRITERIA.forEach(criteria => {
                    CRITERIA.push({
                        name: criteria.name,
                        STARS: this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon),
                        RATE: index > 0 ? -1 : row.RATE,
                    });
                });
                row.CRITERIA = CRITERIA;
                delete row["'STARS'"];
            });
        } else {
            this.bmxItem.componentText.forEach((row, index) => {
              if(row.RATE){
                row.RATE = index > 0 ? -1 : row.RATE;
              }
                row.STARS = this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon);
                delete row['CRITERIA'];
            });
        }

        this.dataSource = this.bmxItem.componentText;
    } else {
        this.autoSizeColumns('RATE', '', this.rankingScaleValue);
        if (this.ASSIGNED_CRITERIA.length > 0) {
            this.bmxItem.componentSettings[0].CRITERIA = true;
            this.bmxItem.componentText.forEach((row, index) => {
                let CRITERIA = [];
                this.ASSIGNED_CRITERIA.forEach(criteria => {
                    CRITERIA.push({
                        name: criteria.name,
                        STARS: this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon),
                        RATE: index > 0 ? -1 : 'RATE',
                    });
                });
                row.CRITERIA = CRITERIA;
                delete row["'STARS'"];
            });
        } else {
            this.bmxItem.componentSettings[0].CRITERIA = false;
            this.bmxItem.componentText.forEach((row, index) => {
                row.STARS = this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon);
                row.RATE = index > 0 ? -1 : 'RATE';
                delete row['CRITERIA'];
            });
        }
    }

    setTimeout(() => {
        this.rowsCount = this.bmxItem.componentText.length - 1;

        if (this.newSet) {
            this.bmxItem.componentSettings[0].minRule = this.rowsCount;
            this.bmxItem.componentSettings[0].maxRule = this.rowsCount;
            this.newSet = false;
        }

        if (this.bmxItem.componentSettings[0].CRITERIA) {
            this.bmxItem.componentSettings[0].minRule = this.bmxItem.componentSettings[0].minRule;
            this.bmxItem.componentSettings[0].maxRule = this.bmxItem.componentSettings[0].maxRule;
        }

        this.dragRows = false;
    }, 0);
}


  verifyCritera() {
    if (this.bmxItem.componentSettings[0].CRITERIA) {
      //MULTIPLY FOR THE AMOUNT OF CRITERIA
      this.bmxItem.componentSettings[0].minRule = this.bmxItem.componentSettings[0].minRule
      this.bmxItem.componentSettings[0].maxRule = this.bmxItem.componentSettings[0].maxRule

    }
  }
  // DEPRECATED
  ramdomizeArray() {
    this.TESTNAMES_LIST.sort(() => Math.random() - 0.5);
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

  autoSizeColumns(columnName, testName, rankingValue?) {

    let testNameLength;
    testNameLength = testName != undefined ? testName.length : 0;

    if (columnName == 'nameCandidates') {
      if (testNameLength > 10 && this.bmxItem.componentSettings[0].nameCandidatesWidth < 150) {
        this.bmxItem.componentSettings[0].nameCandidatesWidth = 150
      } else if (testNameLength > 13) {
        this.bmxItem.componentSettings[0].nameCandidatesWidth = 175
      }
    } else if (columnName == 'rationale') {
      if (testNameLength > 10 && this.bmxItem.componentSettings[0].rationalewidth < 150) {
        this.bmxItem.componentSettings[0].rationalewidth = 150
      } else if (testNameLength > 15) {
        this.bmxItem.componentSettings[0].rationalewidth = 300
      }
    } else if (columnName == 'RATE') {
      if (rankingValue == 5) {
        this.bmxItem.componentSettings[0].rateWidth = 155
      } else if (rankingValue == 6) {
        this.bmxItem.componentSettings[0].rateWidth = 165
      } else if (rankingValue == 7) {
        this.bmxItem.componentSettings[0].rateWidth = 185
      } else if (rankingValue == 8) {
        this.bmxItem.componentSettings[0].rateWidth = 205
      } else if (rankingValue == 9) {
        this.bmxItem.componentSettings[0].rateWidth = 225
      } else if (rankingValue == 10) {
        this.bmxItem.componentSettings[0].rateWidth = 245
      }
    } else if (columnName == 'ExtraColumn1') {
      if (testNameLength > 10 && this.bmxItem.componentSettings[0].columnWidth < 150) {
        this.bmxItem.componentSettings[0].columnWidth = 150
      } else if (testNameLength > 13) {
        this.bmxItem.componentSettings[0].columnWidth = 175
      }
    } else if (columnName == 'ExtraColumn2') {
      if (testNameLength > 10 && this.bmxItem.componentSettings[0].columnWidth < 150) {
        this.bmxItem.componentSettings[0].columnWidth = 150
      } else if (testNameLength > 13) {
        this.bmxItem.componentSettings[0].columnWidth = 175
      }
    } else {
      if (testNameLength > 10 && this.bmxItem.componentSettings[0].columnWidth < 150) {
        this.bmxItem.componentSettings[0].columnWidth = 150
      } else if (testNameLength > 13) {
        this.bmxItem.componentSettings[0].columnWidth = 175
      }
    }
  }

  // COLUMNS ADD AND REMOVE
  insertTextColumn() {
    this.recordHistory()
    this.columnsNames.push('ExtraColumn' + (this.extraColumnCounter));
    this.bmxItem.componentText.forEach((object) => {
      let coulmnName = 'ExtraColumn' + this.extraColumnCounter
      object[coulmnName] = 'Text Column'
    });
    this.extraColumnCounter++
  }

  insertCommentBoxColumn() {
    this.recordHistory()
    this.commentColumnCounter = 0
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
        object[coulmnName] = 'Comments'
      }
    });

    this.bmxItem.componentSettings[0].commentsWidth = 165
  }

  insertRadioColumn() {
    this.recordHistory()
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

  columnFontSizeAdjust(columnName, direction) {
    if (!columnName.includes('RATE') && !columnName.includes('RadioColumn') && !columnName.includes('Comments')) {
      if (direction == 'increase') {
        this.columnFontSize += 1
      } else {
        this.columnFontSize -= 1
      }
      this.bmxItem.componentText.forEach((row, index) => {
        if (index > 0) {
          var regex = /(<([^>]+)>)/ig
          row[columnName] = row[columnName].replace(regex, "");
          row[columnName] = '<span ' + 'style="font-size:' + this.columnFontSize + 'px">' + row[columnName] + '</span>'
        }
      });
    }
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
    this.bmxItem.componentText[y][name] = !this.bmxItem.componentText[y][name]
    this.RadioColumnList.forEach((columnName, index) => {
      // if (columnName.includes('RadioColumn')) {
      if (this.bmxItem.componentText[y][columnName]) {
        if (this.bmxItem.componentType == 'ranking-scale' || true) {
          if (this.bmxItem.componentSettings[0].rankType != 'dinamycRadio') {
            this.bmxItem.componentText.forEach((element, i) => {
              if (element.RATE == index + 1) {
                this.bmxItem.componentText[i].RATE = 0
                this.RadioColumnList.forEach(radioColumnName => {
                  this.bmxItem.componentText[i][radioColumnName] = false
                });
              }
            });
          } else {
            this.bmxItem.componentText.forEach((element, i) => {
              // if (element.RATE == index + 1) {
              if (this.bmxItem.componentSettings[0].rankType != 'dinamycRadio') {
                this.bmxItem.componentText[i].RATE = 0
              }
              this.RadioColumnList.forEach(radioColumnName => {
                if (this.bmxItem.componentSettings[0].rankType != 'dinamycRadio') {
                  this.bmxItem.componentText[i][radioColumnName] = false
                }

              });
              // }
            });
          }

        }
        this.bmxItem.componentText[y].RATE = index + 1
      }
      // }
    });
    //autosave
    this.autoSave.emit();
  }

  deletRow(option): void {
    if (confirm('Are you sure you want to delete this row?')) {
      this.recordHistory()
      this.bmxItem.componentText.splice(option, 1);
    }
  }

  insertRow(): void {
    this.recordHistory()
    const newRow = Object.assign({}, this.bmxItem.componentText[0]);
    this.bmxItem.componentText.push(newRow)
  }

  swapColumns(index: number): void {
    if (index < 0 || index >= this.columnsNames.length - 1) {
      // No se puede mover hacia la derecha si está en el último índice o fuera de rango
      return;
    }
    this.recordHistory();
    const temp = this.columnsNames[index];
    // Intercambia la columna en la posición index con la siguiente
    this.columnsNames[index] = this.columnsNames[index + 1];
    this.columnsNames[index + 1] = temp;

    this.bmxItem.componentText.forEach((row, rowIndex) => {
      const newRow: { [key: string]: any } = {};
      this.columnsNames.forEach((col, i) => {
        if (row.hasOwnProperty(col)) {
          newRow[col] = row[col];
        }
      });
      this.bmxItem.componentText[rowIndex] = this.mergeObjects(newRow, row);
    });
  }

  swapColumnsLeft(index: number): void {
    if (index <= 0 || index >= this.columnsNames.length) {
      // No se puede mover hacia la izquierda si está en el primer índice o fuera de rango
      return;
    }
    this.recordHistory();
    const temp = this.columnsNames[index];
    // Intercambia la columna en la posición index con la anterior
    this.columnsNames[index] = this.columnsNames[index - 1];
    this.columnsNames[index - 1] = temp;

    this.bmxItem.componentText.forEach((row, rowIndex) => {
      const newRow: { [key: string]: any } = {};
      this.columnsNames.forEach((col, i) => {
        if (row.hasOwnProperty(col)) {
          newRow[col] = row[col];
        }
      });
      this.bmxItem.componentText[rowIndex] = this.mergeObjects(newRow, row);
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
    if(columnName.includes('RadioColumn')){
      this.radioColumnCounter--
    }
    this.recordHistory()
    let temporary = []
    if (columnName.includes('Comments') && this.commentColumnCounter > 0) {
      this.commentColumnCounter--
    }
    // REMOVE THE COLUMN FROM THE COLUMNS
    this.columnsNames.forEach((element, index) => {
      if (element !== columnName) {
        temporary.push(element)
      }
    });
    this.columnsNames = temporary;
    this.bmxItem.componentText.forEach((object, index) => {
      delete this.bmxItem.componentText[index][columnName]
    });
    this.bmxItem.componentText = this.bmxItem.componentText;
    this.showDialog = false
  }

  criteriaSelection(selectedCriteria) {
    this.ASSIGNED_CRITERIA = this.newselectedCriteria
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
      this.newSet = true;
      this.rowsCount = rows.length - 1
    }, 1000);
  }

  recordHistory() {
    const history = JSON.parse(JSON.stringify(this.bmxItem))
    const columsNames = JSON.parse(JSON.stringify(this.columnsNames))
    this.HISTORY.push([history, columsNames])
  }
  closeDialog() {
    this.showDialog = false
  }

  openDialog(type: any, component?: any) {
    this.actionType = type
    if (type === 'delete') {
      this.templateToDelete = component
      this.dialogText = "Are you sure you want to delete this component?"
    } if (type === 'save') {
      this.dialogText == "Are you sure you want to overwrite the current project?"
    } if (type === 'undo') {
      this.dialogText = "Are you sure you want undo last change?"
    } else if (this.actionType === 'delete column') {
      this.templateToDelete = component
      this.dialogText = "Are you sure you want to delete this column?"
    }


    this.showDialog = true
  }

  confirmAction() {
    if (this.actionType === 'delete') {
      this.deleteComponent(this.templateToDelete)
    } else if (this.actionType === 'save') {
      this.saveData()
    } else if (this.actionType === 'undo') {
      this.undo()
    } else if (this.actionType === 'delete column') {
      this.deleteColumn(this.templateToDelete)
    }
  }
  saveData() {
    throw new Error('Method not implemented.');
  }
  deleteComponent(templateToDelete: any) {
    throw new Error('Method not implemented.');
  }

  undo() {
    if (this.HISTORY.length > 0) {
      this.dragRows = true;
      const temp = this.HISTORY.pop()
      Object.assign(this.bmxItem, temp[0])
      // Object.assign(this.columnsNames, temp[1])
      this.columnsNames = temp[1]
      setTimeout(() => {
        this.dragRows = false;
      }, 1000);
    }
    this.showDialog = false
  }

  playTestNameSound(testNameSound: string) {
    let audio = new Audio();
    // testNameSound = 'names/hero_decorative-celebration-01'
    audio.src = "assets/sound/names/" + testNameSound + ".mp3";
    audio.volume = 0.8;
    audio.load();
    audio.addEventListener("error", function (e) {
      alert('No audio file found at url: ' + this.src);
    });
    audio.play();
  }

  setPronunciation() {
    this.bmxItem.componentSettings[0]['displaySound'] = !this.displaySound
    this.displaySound = !this.displaySound
  }

  ASSIGNED_CRITERIA = []
  CRITERIA = [
    { name: 'Fit to Compound Concept' },
    { name: 'Fit to Corporate Mission' },
    { name: 'Overall Likeability' },
  ]

  showMatrixMenuBmx() {
    this.showMatrixMenu = !this.showMatrixMenu;
    if (this.showMatrixMenu) {
      this.iconMenuShow = "remove_circle_outline"
      this.textToolTip = "close menu";
    } else {
      this.iconMenuShow = "add_circle_outline"
      this.textToolTip = 'open menu'
    }
  }
  saveSelection() {

    if (!this.modalChecked._checked) {
      localStorage.setItem('showModal', JSON.stringify(false));

    } else {
    }
  }
}
