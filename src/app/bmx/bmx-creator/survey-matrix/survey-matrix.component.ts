import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import Speech from 'speak-tts';
import { ActivatedRoute } from '@angular/router';
import { BmxService } from '../bmx.service';
import { DragulaService } from 'ng2-dragula';
import { SurveyCreationDesignComponent } from '../survey-creation-design/survey-creation-design.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import QRCodeStyling from 'qr-code-styling';
import { defineCustomElements } from '@teamhive/lottie-player/loader';
defineCustomElements(window);
@Component({
  selector: 'app-survey-matrix',
  templateUrl: './survey-matrix.component.html',
  styleUrls: ['./survey-matrix.component.scss'],
})
export class SurveyMatrixComponent extends SurveyCreationDesignComponent implements OnInit {
  loadingLottie = false
  @Input() isMenuActive11;
  @Input() bmxClientPageDesignMode;
  @Input() bmxClientPageOverview;
  myAngularxQrCode = 'https://brandmatrix.brandinstitute.com/BMX/';
  isBrandMatrixSurvey = true;
  isCategoryPage = [];

  bmxPagesClient;
  @ViewChild('canvas', { static: true }) canvas: ElementRef;
  username: any;
  firstName: any;
  lastName: any;

  bradmatrixAnswer;
  projectId;
  popUpQRCode = false;
  isCRITERIA = false;
  elem: any;
  isFullscreen: any;
  searchGraveAccentRegExp = new RegExp('`', 'g');
  surveyLanguage: any;

  totalOfpages = 0
  continueButtonToComple = 'Continue';

  constructor(@Inject(DOCUMENT) document: any, activatedRoute: ActivatedRoute,
   _hotkeysService: HotkeysService, dragulaService: DragulaService, public _snackBar: MatSnackBar, _BmxService: BmxService
  ) {
    super(document, _BmxService, _snackBar, activatedRoute);
    activatedRoute.params.subscribe((params) => {
      this.projectId = params['id'];
      this.username = params['username'];
      localStorage.setItem('projectId', this.projectId);
    });
  }

  ngOnInit(): void {
    this.qrCode = new QRCodeStyling({
      width: 223,
      height: 223,
      data: this.myAngularxQrCode,
      margin: 0,
      qrOptions: { typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'Q' },
      imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 0 },
      dotsOptions: {
          type: 'dots',
          color: '#1023da',
          gradient: {
              type: 'linear',
              rotation: 45,
              colorStops: [
                  {
                      offset: 0,
                      color: '#1023da',
                  },
                  {
                      offset: 3,
                      color: '#8831da',
                  },
              ],
          },
      },
      backgroundOptions: { color: '#fff' },
      image: './assets/img/bmx/bmxCube.jpg',
      cornersSquareOptions: {
          type: 'square',
          color: '#000',
          gradient: {
              type: 'radial',
              rotation: 45,
              colorStops: [
                  {
                      offset: 0,
                      color: '#000',
                  },
              ],
          },
      },
      cornersDotOptions: {
          type: 'dot',
          color: '#000',
          gradient: {
              type: 'linear',
              rotation: 45,
              colorStops: [
                  {
                      offset: 0,
                      color: '#000',
                  },
                  {
                      offset: 3,
                      color: '#000',
                  },
              ],
          },
      },
    });
    if(!this.username){
      this._BmxService.getMatrixClient(this.projectId).subscribe((data: any) => {
        this.bmxClientPageDesignMode = true;
        this.myAngularxQrCode =  this.myAngularxQrCode + this.projectId
        // this.myAngularxQrCode + this.projectId + '/' + this.username;

        data = JSON.parse(data.d);
        this.username = data.UserName
        this.firstName = data.FirstName
        this.lastName = data.LastName
        this.projectId = data.ProjectName

        this.qrCode.append(this.canvas.nativeElement);
        this.bmxPagesClient = this.SAMPLE_BMX_CLIENT;
        this._BmxService
          .getBrandMatrixByProjectAndUserAnswers(this.projectId, this.username)
          .subscribe((brandMatrix: any) => {
    
            //    IF USER ALREADY HAVE ANSWERS
            if (brandMatrix.d.length > 0) {
              let answers = JSON.parse(
                brandMatrix.d.replace(this.searchGraveAccentRegExp, "'")
              );
              this.totalOfpages = answers.length
              this._BmxService
                .getBrandMatrixByProject(this.projectId)
                .subscribe((brandMatrix: any) => {
                  let template = JSON.parse(
                    brandMatrix.d.replace(this.searchGraveAccentRegExp, "'")
                  );
    
                  //  FILL THE TEMPLATE WTIHT USER ANSWERS
                  template.forEach((page, index) => {
                    this.isCategoryPage[index] = { isCategory: false };
                    page.page.forEach((component) => {
                      if (
                        component.componentType == 'rate-scale' ||
                        component.componentType == 'ranking-scale' ||
                        component.componentType == 'image-rate-scale' ||
                        component.componentType == 'narrow-down' ||
                        component.componentType == 'tinder' ||
                        component.componentType == 'question-answer'
                      ) {
    
    
                        // RAMDOMIZE THE TEST NAMES
                        if (component.componentSettings[0].randomizeTestNames) {
                          let headerRow = component.componentText[0]
                          component.componentText.shift()
                          this.radomizedTestNames(component.componentText)
                          component.componentText.unshift(headerRow)
                        }
    
                        // SET SURVEY LANGUAGE
                        if (component.componentSettings[0].language == 'Japanese') {
                          this.surveyLanguage = component.componentSettings[0].language;
    
    
    
                        }
                        // GREETING MESSAGE
                        let message = ''
                        if (this.surveyLanguage == 'Japanese') {
                          message = ' ようこそ '
                        } else {
                          message = 'Welcome   '
                        }
                        setTimeout(() => {
                          this._snackBar.open(

                            message + this.firstName.toUpperCase() + '  😉',
                            '',
                            {
                              duration: 4000,
                              horizontalPosition: 'right',
                              verticalPosition: 'top',
                            }
                          );
                        }, 1000);
    
    
                        if (!this.isCategoryPage[index]['isCategory']) {
                          this.isCategoryPage[index]['isCategory'] = true;
                        }
                        component.componentText.forEach((row, index) => {
                          if (index > 0) {
                            this.matchAnswersAndTemplateMatrix(
                              row,
                              answers,
                              component
                            );
                          }
                        });
                      }
                      else {
                        if (!this.isCategoryPage[index]['isCategory']) {
                          this.isCategoryPage[index]['isCategory'] = false;
                        }
                      }
                    });
                  });
    
                  //  FILL THE TEMPLATE WTIHT USER ANSWERS END
                  this.bmxPagesClient = template;
                  //  this.bmxPagesClient = answers
                });
    
    
    
            } else {
              // USER NEVER ANSWERED LOAD TEMPLATE
              this._BmxService
                .getBrandMatrixByProject(this.projectId)
                .subscribe((brandMatrix: any) => {
                  if (brandMatrix.d.length > 0) {
                    // NEW ANSWERS NEW TEMPLATE
                    let template = JSON.parse(
                      brandMatrix.d.replace(this.searchGraveAccentRegExp, "'")
                    );
    
                    this.totalOfpages = template.length
                    this.bmxPagesClient = JSON.parse(
                      brandMatrix.d.replace(this.searchGraveAccentRegExp, "'")
                    );
                    // CHECK IF THE PAGE IS CATEGORY PAGE
                    this.bmxPagesClient.forEach((page, index) => {
                      this.isCategoryPage[index] = { isCategory: false };
                      page.page.forEach((component) => {
                        this.isCRITERIA = component.componentSettings[0].CRITERIA;
                        if (
                          component.componentType == 'rate-scale' ||
                          component.componentType == 'ranking-scale' ||
                          component.componentType == 'image-rate-scale' ||
                          component.componentType == 'narrow-down' ||
                          component.componentType == 'tinder' ||
                          component.componentType == 'question-answer') {
                          // RAMDOMIZE THE TEST NAMES
                          if (component.componentSettings[0].randomizeTestNames) {
                            let headerRow = component.componentText[0]
                            component.componentText.shift()
                            this.radomizedTestNames(component.componentText)
                            component.componentText.unshift(headerRow)
                          }
                          // SET SURVEY LANGUAGE
                          if (component.componentSettings[0].language == 'Japanese') {
                            this.surveyLanguage = component.componentSettings[0].language;
                          }
    
                          // GREETING MESSAGE
                          let message = ''
                          if (this.surveyLanguage == 'Japanese') {
                            message = ' ようこそ '
                          } else {
                            message = 'Welcome   '
                          }
    
                          setTimeout(() => {
                            this._snackBar.open(
                              message + this.firstName.toUpperCase() + '  😉',
                              '',
                              {
                                duration: 4000,
                                horizontalPosition: 'right',
                                verticalPosition: 'top',
                              }
                            );
                          }, 1000);
    
                          if (!this.isCategoryPage[index]['isCategory']) {
                            this.isCategoryPage[index]['isCategory'] = true;
                          }
                        } else {
                          if (!this.isCategoryPage[index]['isCategory']) {
                            this.isCategoryPage[index]['isCategory'] = false;
                          }
                        }
                      });
                    });
    
                    // this._snackBar.open('bmx LOADED for project  ' + this.projectId , 'OK', {
                    //     duration: 5000,
                    //     horizontalPosition: 'right',
                    //     verticalPosition: 'top'
                    //   })
                  } else {
                    this.bmxPages = this.SAMPLE_BMX_CLIENT;
                  }
                });
            }
          });









      });
    } else {
      this.bmxClientPageDesignMode = true;
      this.myAngularxQrCode =
      this.myAngularxQrCode + this.projectId + '/' + this.username;
  
      this.qrCode.append(this.canvas.nativeElement);
      this.bmxPagesClient = this.SAMPLE_BMX_CLIENT;
      this._BmxService
        .getBrandMatrixByProjectAndUserAnswers(this.projectId, this.username)
        .subscribe((brandMatrix: any) => {
  
          //    IF USER ALREADY HAVE ANSWERS
          if (brandMatrix.d.length > 0) {
            let answers = JSON.parse(
              brandMatrix.d.replace(this.searchGraveAccentRegExp, "'")
            );
            this.totalOfpages = answers.length
            this._BmxService
              .getBrandMatrixByProject(this.projectId)
              .subscribe((brandMatrix: any) => {
                let template = JSON.parse(
                  brandMatrix.d.replace(this.searchGraveAccentRegExp, "'")
                );
  
                //  FILL THE TEMPLATE WTIHT USER ANSWERS
                template.forEach((page, index) => {
                  this.isCategoryPage[index] = { isCategory: false };
                  page.page.forEach((component) => {
                    if (
                      component.componentType == 'rate-scale' ||
                      component.componentType == 'ranking-scale' ||
                      component.componentType == 'image-rate-scale' ||
                      component.componentType == 'narrow-down' ||
                      component.componentType == 'tinder' ||
                      component.componentType == 'question-answer'
                    ) {
  
  
                      // RAMDOMIZE THE TEST NAMES
                      if (component.componentSettings[0].randomizeTestNames) {
                        let headerRow = component.componentText[0]
                        component.componentText.shift()
                        this.radomizedTestNames(component.componentText)
                        component.componentText.unshift(headerRow)
                      }
  
                      // SET SURVEY LANGUAGE
                      if (component.componentSettings[0].language == 'Japanese') {
                        this.surveyLanguage = component.componentSettings[0].language;
  
  
  
                      }
                      // GREETING MESSAGE
                      let message = ''
                      if (this.surveyLanguage == 'Japanese') {
                        message = ' ようこそ '
                      } else {
                        message = 'Welcome   '
                      }
  
                      setTimeout(() => {
                        this._snackBar.open(
                          message + this.username.toUpperCase() + '  😉',
                          '',
                          {
                            duration: 4000,
                            horizontalPosition: 'right',
                            verticalPosition: 'top',
                          }
                        );
                      }, 1000);
  
  
                      if (!this.isCategoryPage[index]['isCategory']) {
                        this.isCategoryPage[index]['isCategory'] = true;
                      }
                      component.componentText.forEach((row, index) => {
                        if (index > 0) {
                          this.matchAnswersAndTemplateMatrix(
                            row,
                            answers,
                            component
                          );
                        }
                      });
                    }
                    else {
                      if (!this.isCategoryPage[index]['isCategory']) {
                        this.isCategoryPage[index]['isCategory'] = false;
                      }
                    }
                  });
                });
  
                //  FILL THE TEMPLATE WTIHT USER ANSWERS END
                this.bmxPagesClient = template;
                //  this.bmxPagesClient = answers
              });
  
  
  
          } else {
            // USER NEVER ANSWERED LOAD TEMPLATE
            this._BmxService
              .getBrandMatrixByProject(this.projectId)
              .subscribe((brandMatrix: any) => {
                if (brandMatrix.d.length > 0) {
                  // NEW ANSWERS NEW TEMPLATE
                  let template = JSON.parse(
                    brandMatrix.d.replace(this.searchGraveAccentRegExp, "'")
                  );
  
                  this.totalOfpages = template.length
                  this.bmxPagesClient = JSON.parse(
                    brandMatrix.d.replace(this.searchGraveAccentRegExp, "'")
                  );
                  // CHECK IF THE PAGE IS CATEGORY PAGE
                  this.bmxPagesClient.forEach((page, index) => {
                    this.isCategoryPage[index] = { isCategory: false };
                    page.page.forEach((component) => {
                      this.isCRITERIA = component.componentSettings[0].CRITERIA;
                      if (
                        component.componentType == 'rate-scale' ||
                        component.componentType == 'ranking-scale' ||
                        component.componentType == 'image-rate-scale' ||
                        component.componentType == 'narrow-down' ||
                        component.componentType == 'tinder' ||
                        component.componentType == 'question-answer') {
                        // RAMDOMIZE THE TEST NAMES
                        if (component.componentSettings[0].randomizeTestNames) {
                          let headerRow = component.componentText[0]
                          component.componentText.shift()
                          this.radomizedTestNames(component.componentText)
                          component.componentText.unshift(headerRow)
                        }
                        // SET SURVEY LANGUAGE
                        if (component.componentSettings[0].language == 'Japanese') {
                          this.surveyLanguage = component.componentSettings[0].language;
                        }
  
                        // GREETING MESSAGE
                        let message = ''
                        if (this.surveyLanguage == 'Japanese') {
                          message = ' ようこそ '
                        } else {
                          message = 'Welcome   '
                        }
  
                        setTimeout(() => {
                          this._snackBar.open(
                            message + this.username.toUpperCase() + '  😉',
                            '',
                            {
                              duration: 4000,
                              horizontalPosition: 'right',
                              verticalPosition: 'top',
                            }
                          );
                        }, 1000);
  
                        if (!this.isCategoryPage[index]['isCategory']) {
                          this.isCategoryPage[index]['isCategory'] = true;
                        }
                      } else {
                        if (!this.isCategoryPage[index]['isCategory']) {
                          this.isCategoryPage[index]['isCategory'] = false;
                        }
                      }
                    });
                  });
  
                  // this._snackBar.open('bmx LOADED for project  ' + this.projectId , 'OK', {
                  //     duration: 5000,
                  //     horizontalPosition: 'right',
                  //     verticalPosition: 'top'
                  //   })
                } else {
                  this.bmxPages = this.SAMPLE_BMX_CLIENT;
                }
              });
          }
        });
    }

  
  }

  radomizedTestNames(component) {
    component.sort(() => Math.random() - 0.5);
  }
  dragAndDropCounter = 0;
  matchAnswersAndTemplateMatrix(templateRow, answers, templateComponent) {
    // console.log('%cTemplateRow', 'color:orange');
    // console.log(templateRow);
    // 💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜
    answers.forEach((page) => {
      page.page.forEach((answerComponent) => {
        if (
          answerComponent.componentType == 'rate-scale' ||
          answerComponent.componentType == 'image-rate-scale'
        ) {
          answerComponent.componentText.forEach((answerRow, index) => {
            if (!templateComponent.componentSettings[0].CRITERIA) {
              // no criteria
              // if (templateComponent.componentType == 'ranking-scale') {
              if (templateComponent.componentType == answerComponent.componentType) {
                // console.log('%cAnswersRow', 'color:blue');
                // console.log(answerRow);
                if (index > 0) {
                  for (const key in templateRow) {
                    if (key === 'nameCandidates' &&templateRow[key] === answerRow[key]) {
                      templateRow.RATE = answerRow.RATE;
                      templateRow.STARS.forEach((starRow) => {
                        if (starRow.id <= answerRow.RATE) {
                          starRow.styleClass = 'active-rating-star';
                        }
                      });
                      for (const key in templateRow) {
                        if (key.includes('Comments')) {
                          if (index > 0) {
                            templateRow[key] = answerRow[key];
                            // THERE IS A BUG WHEN 2 OR MORE COMMENTS COLUMNS ARE IN THE MATRIX
                            // SO FOR NOW I COMMENT THE LINE BELOW 
                            // answerComponent.componentText.splice(index, 1);
                          }
                        } else if (key.includes('RadioColumn')) {
                          if (index > 0) {
                            templateRow[key] = answerRow[key];
                          }
                        } else if (key == 'SELECTED_ROW') {
                          templateRow[key] = answerRow[key];
                        }
                      }
                    }
                  }
                }
              }
            } else if (templateComponent.componentSettings[0].CRITERIA) {
              // with criteria

              if (
                templateComponent.componentType == answerComponent.componentType
              ) {
                if (index > 0) {
                  for (const key in templateRow) {
                    if (
                      key === 'nameCandidates' &&
                      templateRow[key] === answerRow[key]
                    ) {
                      templateRow.CRITERIA.forEach(
                        (criteria, criteriaIndex) => {
                          if (answerRow.CRITERIA) {
                            criteria.RATE =
                              answerRow.CRITERIA[criteriaIndex].RATE;
                            criteria.STARS.forEach((starRow) => {
                              if (
                                starRow.id <=
                                answerRow.CRITERIA[criteriaIndex].RATE
                              ) {
                                starRow.styleClass = 'active-rating-star';
                              }
                            });
                          }
                        }
                      );
                      for (const key in templateRow) {
                        if (key.includes('Comments')) {
                          if (index > 0) {
                            templateRow[key] = answerRow[key];
                            answerComponent.componentText.splice(index, 1);
                          }
                        } else if (key.includes('RadioColumn')) {
                          if (index > 0) {
                            templateRow[key] = answerRow[key];
                          }
                        } else if (key == 'SELECTED_ROW') {
                          templateRow[key] = answerRow[key];
                        }
                      }
                    }
                  }
                }
              }
            }
          });
        }
        // ❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️
        else if (answerComponent.componentType == 'ranking-scale') {
          if (
            templateComponent.componentSettings[0].rankType == 'dragAndDrop' &&
            answerComponent.componentText.length > 1 &&
            this.dragAndDropCounter == 0
          ) {
            templateComponent.componentText = this.mergeObjectArrays(
              answerComponent.componentText,
              templateComponent.componentText,
              'RATE'
            );
            this.dragAndDropCounter++;
          } else {
            answerComponent.componentText.forEach((answerRow, index) => {
              if (!templateComponent.componentSettings[0].CRITERIA) {
                // no criteria
                // if (templateComponent.componentType == 'ranking-scale') {
                if (
                  templateComponent.componentType ==
                  answerComponent.componentType
                ) {
                  if (index > 0) {
                    for (const key in templateRow) {
                      if (
                        key === 'nameCandidates' &&
                        templateRow[key] === answerRow[key]
                      ) {
                        templateRow.RATE = answerRow.RATE;
                        templateRow.STARS.forEach((starRow) => {
                          if (starRow.id <= answerRow.RATE) {
                            starRow.styleClass = 'active-rating-star';
                          }
                        });
                        for (const key in templateRow) {
                          if (key.includes('Comments')) {
                            if (index > 0) {
                              templateRow[key] = answerRow[key];
                              answerComponent.componentText.splice(index, 1);
                            }
                          } else if (key.includes('RadioColumn')) {
                            if (index > 0) {
                              templateRow[key] = answerRow[key];
                            }
                          } else if (key == 'SELECTED_ROW') {
                            templateRow[key] = answerRow[key];
                          }
                        }
                      }
                    }
                  }
                }
              }
              // THERE IS NOT CRITERIA, THIS CODE IS NOT USED
              else if (templateComponent.componentSettings[0].CRITERIA) {
                // with criteria

                if (
                  templateComponent.componentType ==
                  answerComponent.componentType
                ) {
                  if (index > 0) {
                    for (const key in templateRow) {
                      if (
                        key === 'nameCandidates' &&
                        templateRow[key] === answerRow[key]
                      ) {
                        templateRow.CRITERIA.forEach(
                          (criteria, criteriaIndex) => {
                            criteria.RATE =
                              answerRow.CRITERIA[criteriaIndex].RATE;
                            criteria.STARS.forEach((starRow) => {
                              if (
                                starRow.id <=
                                answerRow.CRITERIA[criteriaIndex].RATE
                              ) {
                                starRow.styleClass = 'active-rating-star';
                              }
                            });
                          }
                        );
                        for (const key in templateRow) {
                          if (key.includes('Comments')) {
                            if (index > 0) {
                              templateRow[key] = answerRow[key];
                              answerComponent.componentText.splice(index, 1);
                            }
                          } else if (key.includes('RadioColumn')) {
                            if (index > 0) {
                              templateRow[key] = answerRow[key];
                            }
                          } else if (key == 'SELECTED_ROW') {
                            templateRow[key] = answerRow[key];
                          }
                        }
                      }
                    }
                  }
                }
              }
            });
          }
        }
        // 💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚
        else if (answerComponent.componentType == 'narrow-down') {
          answerComponent.componentText.forEach((answerRow, index) => {
            if (!templateComponent.componentSettings[0].CRITERIA) {
              // no criteria
              if (
                templateComponent.componentType == answerComponent.componentType
              ) {
                if (index > 0) {
                  for (const key in templateRow) {
                    if (
                      key === 'nameCandidates' &&
                      templateRow[key] === answerRow[key]
                    ) {
                      templateRow.RATE = answerRow.RATE;
                      templateRow.SELECTED_ROW = answerRow.SELECTED_ROW;
                      templateRow.STARS.forEach((starRow) => {
                        if (starRow.id <= answerRow.RATE) {
                          starRow.styleClass = 'active-rating-star';
                        }
                      });
                      for (const key in templateRow) {
                        if (key.includes('Comments')) {
                          if (index > 0) {
                            templateRow[key] = answerRow[key];
                            answerComponent.componentText.splice(index, 1);
                          }
                        } else if (key.includes('RadioColumn')) {
                          if (index > 0) {
                            templateRow[key] = answerRow[key];
                          }
                        } else if (key == 'SELECTED_ROW') {
                          templateRow[key] = answerRow[key];
                        }
                      }
                    }
                  }
                }
              }
            } else if (templateComponent.componentSettings[0].CRITERIA) {
              // with criteria

              if (
                templateComponent.componentType == answerComponent.componentType
              ) {
                if (index > 0) {
                  for (const key in templateRow) {
                    if (
                      key === 'nameCandidates' &&
                      templateRow[key] === answerRow[key]
                    ) {
                      templateRow.CRITERIA.forEach(
                        (criteria, criteriaIndex) => {
                          if (answerRow.CRITERIA) {
                            criteria.RATE =
                              answerRow.CRITERIA[criteriaIndex].RATE;
                            criteria.STARS.forEach((starRow) => {
                              if (
                                starRow.id <=
                                answerRow.CRITERIA[criteriaIndex].RATE
                              ) {
                                starRow.styleClass = 'active-rating-star';
                              }
                            });
                          }
                        }
                      );
                      for (const key in templateRow) {
                        if (key.includes('Comments')) {
                          if (index > 0) {
                            templateRow[key] = answerRow[key];
                            answerComponent.componentText.splice(index, 1);
                          }
                        } else if (key.includes('RadioColumn')) {
                          if (index > 0) {
                            templateRow[key] = answerRow[key];
                          }
                        } else if (key == 'SELECTED_ROW') {
                          templateRow[key] = answerRow[key];
                        }
                      }
                    }
                  }
                }
              }
            }
          });
        }
        // 💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛
        else if (answerComponent.componentType == 'question-answer') {
          answerComponent.componentText.forEach((answerRow, index) => {
            if (!templateComponent.componentSettings[0].CRITERIA) {
              // ITERATE OVER EACH ANSWER ROW
              if (
                templateComponent.componentType == answerComponent.componentType
              ) {
                if (index > 0) {
                  for (const key in templateRow) {
                    if (
                      key === 'nameCandidates' &&
                      // IF THE TESTNAME IS THE SAME TRANSFER THE ANSWER TO THE TEMPLATE
                      templateRow[key] === answerRow[key]
                    ) {
                      templateRow.RATE = answerRow.RATE;
                      templateRow.STARS.forEach((starRow) => {
                        if (starRow.id <= answerRow.RATE) {
                          starRow.styleClass = 'active-rating-star';
                        }
                      });
                      for (const key in templateRow) {
                        if (key.includes('Answer')) {
                          if (index > 0) {
                            templateRow[key] = answerRow[key];
                            answerComponent.componentText.splice(index, 1);
                          }
                        } else if (key.includes('RadioColumn')) {
                          if (index > 0) {
                            templateRow[key] = answerRow[key];
                          }
                        } else if (key == 'options') {
                          templateRow[key] = answerRow[key];
                          for (let key in answerRow) {
                            if (key.includes('multipleChoice')) {
                              templateRow[key] = answerRow[key]
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            } else if (templateComponent.componentSettings[0].CRITERIA) {
              // with criteria
              if (
                templateComponent.componentType == answerComponent.componentType
              ) {
                if (index > 0) {
                  for (const key in templateRow) {
                    if (
                      key === 'nameCandidates' &&
                      templateRow[key] === answerRow[key]
                    ) {
                      templateRow.CRITERIA.forEach(
                        (criteria, criteriaIndex) => {
                          criteria.RATE =
                            answerRow.CRITERIA[criteriaIndex].RATE;
                          criteria.STARS.forEach((starRow) => {
                            if (
                              starRow.id <=
                              answerRow.CRITERIA[criteriaIndex].RATE
                            ) {
                              starRow.styleClass = 'active-rating-star';
                            }
                          });
                        }
                      );
                      for (const key in templateRow) {
                        if (key.includes('Comments')) {
                          if (index > 0) {
                            templateRow[key] = answerRow[key];
                            answerComponent.componentText.splice(index, 1);
                          }
                        } else if (key.includes('RadioColumn')) {
                          if (index > 0) {
                            templateRow[key] = answerRow[key];
                          }
                        } else if (key == 'SELECTED_ROW') {
                          templateRow[key] = answerRow[key];
                        }
                      }
                    }
                  }
                }
              }
            }
          });
        }
        //🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
        else if (answerComponent.componentType == 'tinder') {
          answerComponent.componentText.forEach((answerRow, index) => {
            if (!templateComponent.componentSettings[0].CRITERIA) {
              // no criteria
              // if (templateComponent.componentType == 'ranking-scale') {
              if (
                templateComponent.componentType == answerComponent.componentType
              ) {
                if (index > 0) {
                  for (const key in templateRow) {
                    if (
                      key === 'nameCandidates' &&
                      templateRow[key] === answerRow[key]
                    ) {
                      templateRow.vote = answerRow.vote;

                      for (const key in templateRow) {
                        if (key.includes('Answer')) {
                          if (index > 0) {
                            templateRow[key] = answerRow[key];
                            answerComponent.componentText.splice(index, 1);
                          }
                        } else if (key.includes('RadioColumn')) {
                          if (index > 0) {
                            templateRow[key] = answerRow[key];
                          }
                        } else if (key == 'SELECTED_ROW') {
                          templateRow[key] = answerRow[key];
                        }
                      }
                    }
                  }
                }
              }
            } else if (templateComponent.componentSettings[0].CRITERIA) {
              // with criteria

              if (
                templateComponent.componentType == answerComponent.componentType
              ) {
                if (index > 0) {
                  for (const key in templateRow) {
                    if (
                      key === 'nameCandidates' &&
                      templateRow[key] === answerRow[key]
                    ) {
                      templateRow.CRITERIA.forEach(
                        (criteria, criteriaIndex) => {
                          criteria.RATE =
                            answerRow.CRITERIA[criteriaIndex].RATE;
                          criteria.STARS.forEach((starRow) => {
                            if (
                              starRow.id <=
                              answerRow.CRITERIA[criteriaIndex].RATE
                            ) {
                              starRow.styleClass = 'active-rating-star';
                            }
                          });
                        }
                      );
                      for (const key in templateRow) {
                        if (key.includes('Comments')) {
                          if (index > 0) {
                            templateRow[key] = answerRow[key];
                            answerComponent.componentText.splice(index, 1);
                          }
                        } else if (key.includes('RadioColumn')) {
                          if (index > 0) {
                            templateRow[key] = answerRow[key];
                          }
                        } else if (key == 'SELECTED_ROW') {
                          templateRow[key] = answerRow[key];
                        }
                      }
                    }
                  }
                }
              }
            }
          });
        }
      });
    });
  }

  mergeObjectArrays(answerArray, templateArray, property) {
    let result2 = [];
    if (templateArray.length >= answerArray.length) {
      let result = answerArray.concat(templateArray);
      result.forEach((row) => {
        if (result2.length == 0) {
          result2.push(row);
        } else {
          let found = false;
          result2.forEach((resultRow) => {
            if (row.nameCandidates == resultRow.nameCandidates) {
              found = true;
            }
          });
          if (!found) {
            result2.push(row);
          }
        }
      });
    } else {
      templateArray.forEach((row) => {
        answerArray.forEach((resultRow) => {
          if (resultRow['nameCandidates'] == row['nameCandidates']) {
            row.RATE = resultRow.RATE ? resultRow.RATE : 0;
            result2.push(row);
          }
        });
      });
    }
    result2.sort(function (a, b) {
      if (a[property] < b[property]) {
        return -1;
      }
      if (a[property] > b[property]) {
        return 1;
      }
      return 0;
    });
    return result2;
  }

  changePage(direction) {
    if (direction === 'next' && this.bmxPagesClient.length - 1 > this.currentPage) {
      this.selectPageNumber(this.currentPage + 1);
    } else if (direction === 'previous' && this.currentPage > 0) {
      this.selectPageNumber(this.currentPage - 1);
    } else {
      if (this.continueButtonToComple  == 'Complete') {
        window.open('https://www.brandinstitute.com/', '_self');
      }
    }
    if(this.totalOfpages == this.currentPage + 1){
      this.loadingLottie = true;
    }
  }

  selectPageNumber(pageNumber) {
    // IF PAGE IS NOT CATEGORY PAGE PASS THE PAGE
    if (this.isCategoryPage[this.currentPage]['isCategory']) {
      if (this.currentPage < pageNumber) {
        this.bmxPagesClient[this.currentPage].page.forEach((component) => {
          if (component.componentType == 'rate-scale' ||
            component.componentType == 'ranking-scale' ||
            component.componentType == 'image-rate-scale' ||
            component.componentType == 'narrow-down' ||
            component.componentType == 'question-answer'
          ) {

            // ANSWERS COUNTER
            let minRuleCounter = 0
            component.componentText.forEach((row, index) => {

              // HANDLING SPECAIL REQUEST ******************************************//
              if (component.componentSettings[1]) {
                if (!component.componentSettings[1].isImageType && row.RATE == 1) {
                  let payload = {
                    tesName: row.nameCandidates
                  }
                  this._BmxService.setSpecialDataObservable(payload)
                }
              }
              // HANDLING SPECAIL REQUEST END  ******************************************//

              if (component.componentSettings[0].CRITERIA) {


                row.CRITERIA.forEach((criteria) => {
                  // NARROW DOWN WITH CRITERIA
                  if (component.componentType == 'narrow-down') {
                    if (row.SELECTED_ROW) {
                      let rater = row.CRITERIA.filter((criteria) => (criteria.RATE == -1 || criteria.RATE == 0))
                      if (component.componentSettings[0].categoryRulesPassed) {
                        component.componentSettings[0].categoryRulesPassed = (index > 0 && rater.length > 0) ? false : true;
                      }
                      if (index > 0 && rater.length == 0) {
                        minRuleCounter++
                      }
                    }
                  } else {

                    let rater = row.CRITERIA.filter((criteria) => (criteria.RATE == -1 || criteria.RATE == 0))
                    if (component.componentSettings[0].categoryRulesPassed) {
                      component.componentSettings[0].categoryRulesPassed = (index > 0 && rater.length > 0) ? false : true;
                    }
                    if (index > 0 && rater.length == 0) {
                      minRuleCounter++
                    }
                  }
                });
              } else {
                // ONLY NARROWDOWN
                if (component.componentType == 'narrow-down') {
                  if (row.SELECTED_ROW) {
                    if (index > 0 && (row.RATE != -1 && row.RATE != 0) && typeof row.RATE == 'number') {
                      minRuleCounter++
                    }
                    if (component.componentSettings[0].categoryRulesPassed) {
                      component.componentSettings[0].categoryRulesPassed = (row.RATE == -1 || row.RATE == 0 || typeof row.RATE != 'number') ? false : true;
                    }
                  }
                } else {
                  // THE OTHER COMPONENTS
                  if (index > 0 && (row.RATE != -1 && row.RATE != 0)) {
                    minRuleCounter++
                  }
                  if (component.componentSettings[0].categoryRulesPassed) {
                    component.componentSettings[0].categoryRulesPassed = (row.RATE == -1 || row.RATE == 0) ? false : true;
                  }
                }
              }
            });

            // EVALUATION AFTER COUNTING

            if (component.componentSettings[0].CRITERIA) {
              minRuleCounter = minRuleCounter / 2
            }

            if (component.componentType == 'narrow-down') {
              component.componentSettings[0].categoryRulesPassed = (minRuleCounter != component.componentSettings[0].minRule) ? false : true;
            }

            if (component.componentSettings[0].minRule == minRuleCounter) {
              component.componentSettings[0].categoryRulesPassed = true;
            }

            if (
              component.componentSettings[0].minRule == 0 ||
              component.componentSettings[0].categoryRulesPassed ||
              (component.componentSettings[0].minRule - minRuleCounter) <= 0
            ) {
              this.currentPage = pageNumber;
              window.scroll(0, 0);
              setTimeout(() => {
                this.saveUserAnswers(pageNumber);
              }, 2000);
            } else {
              let minRule = component.componentSettings[0].minRule
              if (component.componentSettings[0].CRITERIA) {
                minRule = component.componentSettings[0].minRule
                // minRule = component.componentSettings[0].minRule / component.componentText[1].CRITERIA.length
              }
              let message1 = ''
              let message2 = ''
              let ok = ''
              if (this.surveyLanguage == 'Japanese') {
                message1 = ' 最低 '
                message2 = ' ネーム案以上を選択して下さい  '
                ok = 'OK'
              } else {
                message1 = ' You must rate at least '
                message2 = ' Test Names '
                ok = 'OK'
              }
              this._snackBar.open(
                message1 +
                minRule +
                message2,
                ok,
                {
                  duration: 5000,
                  verticalPosition: 'top',
                }
              );
            }
          } else {
            // this.currentPage = pageNumber;
          }
        });
      } else {
        this.currentPage = pageNumber;
        window.scroll(0, 0);
      }
    } else {
      this.currentPage = pageNumber;
    }
  }

  saveUserAnswers(pageNumber?) {
    
    let pageStatus = (this.totalOfpages == this.currentPage + 1)?999: this.currentPage + 1;
    this.continueButtonToComple = (this.totalOfpages == this.currentPage + 1)?'Complete': 'Continue';
    
    this._BmxService
      // .saveOrUpdateAnswers(this.bmxPagesClient, this.projectId, this.username, (pageNumber ? pageNumber : pageStatus))
      .saveOrUpdateAnswers(this.bmxPagesClient, this.projectId, this.username, pageStatus)
      .subscribe((res: any) => {
        this.loadingLottie = false;
        console.log('%cANSWERS!', 'color:#007bff', res);
        let page = res.d.replace(this.searchGraveAccentRegExp, "'");
        let message = ''
        if (this.surveyLanguage == 'Japanese') {
          message = ' ご投票頂いた内容を確かに保存いたしました。'
        } else {
          message = ' your answers were saved  '
        }

        this._snackBar.open(
            message,
          // this.username.toUpperCase() + message,
          'OK',
          {
            duration: 5000,
            verticalPosition: 'top',
          }
        );
      });
  }

  SAMPLE_BMX_CLIENT = [
    {
      pageNumber: 1,
      page: [
        {
          componentType: 'logo-header',
          componentText: 'WRONG PROJECT OR USERNAME ',
          componentSettings: [
            {
              fontSize: '16px',
              fontFace: 'Arial',
              logoWidth: 100,
              brandInstituteLogoURL:
                './assets/img/bmx/BRANDMATRIX-DASHBOARD-LOGO.svg',
              brandInstituteSurveyLogoURL:
                './assets/img/bmx/bm-logo-2020-high.png',
              brandInstituteMobileURL: './assets/img/bmx/bmxCube.jpg',
              companyLogoURL: './assets/img/bmx/insertLogo.jpg',
            },
          ],
        },
      ],
    },
  ];
}
