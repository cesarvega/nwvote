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
@Component({
  selector: 'app-survey-matrix',
  templateUrl: './survey-matrix.component.html',
  styleUrls: ['./survey-matrix.component.scss'],
})
export class SurveyMatrixComponent
  extends SurveyCreationDesignComponent
  implements OnInit {
  @Input() isMenuActive11;
  @Input() bmxClientPageDesignMode;
  @Input() bmxClientPageOverview;
  myAngularxQrCode = 'https://tools.brandinstitute.com/bmxtest/survey/';
  isBrandMatrixSurvey = true;
  isCategoryPage = [];

  bmxPagesClient;

  @ViewChild('canvas', { static: true }) canvas: ElementRef;
  username: any;

  bradmatrixAnswer;
  projectId;
  popUpQRCode = false;
  isCRITERIA = false;
  elem: any;
  isFullscreen: any;
  searchGraveAccentRegExp = new RegExp('`', 'g');
  constructor(
    @Inject(DOCUMENT) document: any,
    activatedRoute: ActivatedRoute,
    _hotkeysService: HotkeysService,
    dragulaService: DragulaService,
    public _snackBar: MatSnackBar,
    _BmxService: BmxService
  ) {
    super(document, _BmxService, _snackBar, activatedRoute);

    activatedRoute.params.subscribe((params) => {
      this.projectId = params['id'];
      this.username = params['username'];
      localStorage.setItem('projectId', this.projectId);
      // this.bsrService.getProjectData(this.projectId).subscribe(arg => {
      //   this.projectName = JSON.parse(arg[0].bsrData).projectdescription;
      //   localStorage.setItem('projectName',  this.projectId);
      // });
    });
  }

  ngOnInit(): void {
    this.bmxClientPageDesignMode = true;
    this.myAngularxQrCode =
      this.myAngularxQrCode + this.projectId + '/' + this.username;
    this._snackBar.open(
      'Welcome   ' + this.username.toUpperCase() + '  😉',
      '',
      {
        duration: 4000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      }
    );
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
          // BMX TEMPLATE LOADER BY PROJECT
          this._BmxService
            .getBrandMatrixByProject(this.projectId)
            .subscribe((brandMatrix: any) => {
              if (brandMatrix.d.length > 0) {
                // NEW ANSWERS NEW TEMPLATE
                let template = JSON.parse(
                  brandMatrix.d.replace(this.searchGraveAccentRegExp, "'")
                );
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
              if (
                templateComponent.componentType == answerComponent.componentType
              ) {
                console.log('%cAnswersRow', 'color:blue');
                console.log(answerRow);
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
                          for(let key in answerRow) {
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
    if (direction === 'next' &&this.bmxPagesClient.length - 1 > this.currentPage) {
      this.selectPageNumber(this.currentPage + 1);
    } else if (direction === 'previous' && this.currentPage > 0) {
      this.selectPageNumber(this.currentPage - 1);
    } 
  }

  selectPageNumber(pageNumber) {
    // IF PAGE IS NOT CATEGORY PAGE PASS THE PAGE
    if (this.isCategoryPage[this.currentPage]['isCategory']) {
      if (this.currentPage < pageNumber) {
        this.bmxPagesClient[this.currentPage].page.forEach((component) => {
          if (component.componentType == 'rate-scale' ||component.componentType == 'ranking-scale' ||component.componentType == 'image-rate-scale' ||component.componentType == 'narrow-down' ||component.componentType == 'question-answer'
          ) {
            if (
              component.componentSettings[0].minRule == 0 ||
              component.componentSettings[0].categoryRulesPassed
            ) {
              this.currentPage = pageNumber;
              window.scroll(0, 0);
              setTimeout(() => {
                this.saveUserAnswers(pageNumber);
              }, 2000);
            } else {
              let minRule = component.componentSettings[0].minRule
              if (component.componentSettings[0].CRITERIA) {
                minRule = component.componentSettings[0].minRule / component.componentText[1].CRITERIA.length
              }

              this._snackBar.open(
                'You must rate at least ' +
                minRule +
                ' Test Names',
                'OK',
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
    this._BmxService
      .saveOrUpdateAnswers(this.bmxPagesClient,this.projectId,this.username,(pageNumber ? pageNumber : this.currentPage + 1))
      .subscribe((res: any) => {
        console.log('%cANSWERS!', 'color:#007bff', res);
        let page = res.d.replace(this.searchGraveAccentRegExp, "'");
        this._snackBar.open(
          this.username.toUpperCase() + ' your answers were saved  ',
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
