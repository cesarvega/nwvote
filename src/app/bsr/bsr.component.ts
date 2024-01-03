import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { CdkDragDrop, moveItemInArray, CdkDropListGroup, transferArrayItem } from '@angular/cdk/drag-drop';
import { BsrService } from './bsr.service';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
//import { BsrService } from './services/bsr.service';


///CKEDITOR NOTES, para que el toolbar del editor pueda ser configurado
//  es necesario de instalar el ckeditor4  y el ckeditor5 y
//  en el index.html importar el script <script src="https://cdn.ckeditor.com/4.14.1/full-all/ckeditor.js"></script>
//  <ckeditor  [(ngModel)]="model.editorData" [data]="dataEditor" [config]="ckconfig"></ckeditor>

@Component({
  selector: 'app-bsr',
  templateUrl: './bsr.component.html',
  styleUrls: ['./bsr.component.scss']
})
export class BsrComponent implements OnInit {

  @ViewChild('slider') slider;
  postItListTheme = 'post-it-list-theme'
  searchBoxLeftProperty = '611px;'
  font_size = '30';
  font_size_text = this.font_size + 'px';
  diplayFontSizeSlider = false;
  loginForm: FormGroup;
  isMouseOver: boolean = false;
  sliderVal = 51;
  totalNumberOfnames = 51;
  slideCss = 'none';
  // projectId = 'rg2327';
  projectId = 'te2687';
  projectName = 'te2687';
  createPostIt = false;
  isDeleteButon = false;
  isSearching = false;
  search: any;
  overview = false;
  isNSR = false;
  isScreenButton = true;
  isScreeningNames = false;
  slideBackground = 'url(http://www.bipresents.com/';
  baseBackgroundUrl = 'url(http://www.bipresents.com/';
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  totalNumberOfSlides: any;
  pageCounter = '';
  currentPageNumber = 0;
  appSlidesData: any;
  mainMenu: boolean = true;
  conceptData: any = [];
  newPost: Object;
  newName: any;
  conceptid: any;
  deletePost: Object;
  nameCandidates: any = [];
  nameBox = true;
  nameBoxB = true;
  myMaxWith = '900px';
  myMaxWith2:any;
  myMaxRWith = '900px';
  myMaxRightWith = '8px';
  showSlider: boolean = false;
  postItPresentationIndex: number;
  appSearchSlidesData: any = [];
  slideBackground2: string;
  nameIndexCounter = 0;
  isCommentBox: boolean = false;
  commentBoxText = "";
  elem: any;
  isFullscreen = false;
  namesBoxIndexValue = 52;
  namesBoxIndex = 0;
  wideScreen = false;
  BackgroundUrl = 'url(http://bipresents.com/nw2/assets/';
  BackgroundUrlOff = 'url(http://bipresents.com/nw2/assets/images/BackGrounds/Backgrounds2019/';
  baseUrl: any;
  restUrl: any;
  wideView: boolean = false;
  SummarySlide: any;

  constructor(@Inject(DOCUMENT) private document: any, private _formBuilder: FormBuilder,
    private _hotkeysService: HotkeysService,
    private _BsrService: BsrService, public dialog: MatDialog, private activatedRoute: ActivatedRoute,
    private dragulaService: DragulaService) {

    dragulaService.createGroup('TASKS', {
      moves: (el, container, handle) => {
        return handle.classList.contains('handle');
      }
    })

    // keyboard keymaps
    this._hotkeysService.add(new Hotkey('right', (event: KeyboardEvent): boolean => {

      this.moveForward();
      return false;
    }, undefined, 'Move to next slide'));
    this._hotkeysService.add(new Hotkey('left', (event: KeyboardEvent): boolean => {
      this.moveBackward();
      return false;
    }, undefined, 'Move to previous slide'));
    this._hotkeysService.add(new Hotkey('up', (event: KeyboardEvent): boolean => {
      this.mainMenu = true;
      return false;
    }, undefined, 'Show menu'));
    this._hotkeysService.add(new Hotkey('down', (event: KeyboardEvent): boolean => {
      this.mainMenu = false;
      return false;
    }, undefined, 'Hide menu'));
    this._hotkeysService.add(new Hotkey('o', (event: KeyboardEvent): boolean => {
      this.sideMenu();
      return false;
    }, undefined, 'Hide/Show slide overview'));
    // this._hotkeysService.add(new Hotkey('b', (event: KeyboardEvent): boolean => {
    //   // this.removeBackground();
    //   return false;
    // }, undefined, 'Remove background'));
    // this._hotkeysService.add(new Hotkey('s', (event: KeyboardEvent): boolean => {
    //   // this.timeToDisplayticker();
    //   return false;
    // }, undefined, 'Show stock ticker'));
    this._hotkeysService.add(new Hotkey('esc', (event: KeyboardEvent): boolean => {
      this._hotkeysService.cheatSheetToggle.next(false);
      this.mainMenu = false;
      return false;
    }, undefined, 'Hide help sheet'));
    this._hotkeysService.add(new Hotkey('ctrl+b', (event: KeyboardEvent): boolean => {
      this.bsr();
      return false;
    }, undefined, 'Toogle Presentation Mode'));
  }

  ngOnInit(): void {

    this.baseUrl = this._BsrService.getBaseUrlForResources();

    if (this.baseUrl === 'https://bitools.s3.amazonaws.com/nw-resources/') {
      this.BackgroundUrl = 'https://d3lyn5npnikbck.cloudfront.net/'
    }
    console.log(this.BackgroundUrl)

    this.font_size_text = (localStorage.getItem(this.projectName + '_font_size_text')) ? localStorage.getItem(this.projectName + '_font_size_text') : '26px';
    this.font_size = (localStorage.getItem(this.projectName + '_font_size')) ? localStorage.getItem(this.projectName + '_font_size') : '26';
    this.activatedRoute.params.subscribe(params => {

      // set project ID as localstorage identifier 03/16/21
      this.projectName = params['id'];
      this._BsrService.setProjectName(this.projectName);
      localStorage.setItem(this.projectName + '_projectId', this.projectName);
      localStorage.setItem(this.projectName + '_projectName', this.projectName);
      this.projectId = this.projectName;
    });

    this.assignCopy();
    this.elem = document.documentElement;
    this.currentPageNumber = 0;
    this.postItListTheme = localStorage.getItem(this.projectName + '_post-it-list-theme');
    this._BsrService.getSlides(this.projectId).subscribe((res: any) => {
      console.log(res);
      this.appSlidesData = res;
      this.SummarySlide = res[0].SummarySlide
      // this.appSearchSlidesData = res;
      localStorage.setItem(this.projectName + '_appSlideData', JSON.stringify(res));
      this.totalNumberOfSlides = res.length;
      this.pageCounter = '1/' + (parseInt(this.totalNumberOfSlides));
      console.log(this.slideBackground + res)
      this.slideBackground = this.slideBackground + res[0].SlideBGFileName + ')';
      this.appSlidesData.forEach(element => {
        if (element.SlideType === "NameSummary") {
          this.postItPresentationIndex = parseInt(element.$id) - 1;
        }
      });
      this.createPostIt = (localStorage.getItem(this.projectName + '_createPostIt') === 'true') ? true : false;
      if (this.createPostIt) {
        this.searchBoxLeftProperty = '777px';
        this.currentPageNumber = (this.createPostIt) ? this.postItPresentationIndex : 0;
      } else {
        this.searchBoxLeftProperty = '611px;';
        this.currentPageNumber = 0;

      }
      this.wideView = res[0].isWide
      console.log(res[0],this.wideView)
    })

    this._BsrService.getPost().subscribe((res: any) => {
      this.conceptData = JSON.parse(res[0].bsrData);

      if (JSON.parse(res[0].bsrData).presentationtype === 'NSR') {
        this.isNSR = true;
      }

      this.conceptData.concepts.forEach(element => {
        element.concept = element.concept.replace(/`/g, "'");
        element.html = element.html.replace(/`/g, "'");
      });
      console.log(this.conceptData);
    });

    setInterval(() => {
      this._BsrService.getNameCandidates(this.projectId).subscribe((res: any) => {
        res.forEach(name => {
          name.html = name.html.replace(/\\/g, '');
        });
        this.nameCandidates = (res.length > 0) ? res : [];
      });
    }, 300);

    this.getCommentsByIndex(0);
    this.loginForm = this._formBuilder.group({
      rationale: [''],
      suma: [''],
      name: ['']
    });
    this.nameIndexCounter = (localStorage.getItem(this.projectName + '_namesIndexCounte')) ? parseInt(localStorage.getItem(this.projectName + '_namesIndexCounte')) : 0;


    this.onInputChange(parseInt(localStorage.getItem(this.projectName + '_namesBoxIndex')));
  }

  getCommentsByIndex(index) {
    this._BsrService.getComments(index).subscribe((arg: any) => {
      if (arg.length > 0) {
        this.commentBoxText = arg[0].Comments;
      } else {
        this.commentBoxText = '';
      }
    });
  }

  boxWidth = 155;
  // calculated based on dynamic row width
  columnSize: number;

  getItemsTable(rowLayout: Element): number[][] {
    // calculate column size per row
    const { width } = rowLayout.getBoundingClientRect();
    const columnSize = Math.round(width / this.boxWidth);
    // view has been resized? => update table with new column size
    if (columnSize != this.columnSize) {
      this.columnSize = columnSize;
      this.initTable();
    }
    this.conceptData.concepts.forEach(element => {
      element.concept = element.concept.replace(/`/g, "'");
      element.html = element.html.replace(/`/g, "'");
    });
    return this.conceptData.concepts;
  }

  initTable() {
    // create table rows based on input list
    // example: [1,2,3,4,5,6] => [ [1,2,3], [4,5,6] ]
    this.conceptData.concepts = this.conceptData.concepts
      .filter((_, outerIndex) => outerIndex % this.columnSize == 0) // create outter list of rows
      .map((
        _,
        rowIndex // fill each row from...
      ) =>
        this.conceptData.concepts.slice(
          rowIndex * this.columnSize, // ... row start and
          rowIndex * this.columnSize + this.columnSize // ...row end
        )
      );
  }

  reorderDroppedItem(event: CdkDragDrop<number[]>) {
    // same row/container? => move item in same row
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // different rows? => transfer item from one to another list
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    // update items after drop: flatten matrix into list
    // example: [ [1,2,3], [4,5,6] ] => [1,2,3,4,5,6]
    this.conceptData.concepts = this.conceptData.concepts.reduce(
      (previous, current) => previous.concat(current),
      []
    );

    // re-initialize table - makes sure each row has same numbers of entries
    // example: [ [1,2], [3,4,5,6] ] => [ [1,2,3], [4,5,6] ]
    this.initTable();
  }

  drop(event: CdkDragDrop<string[]>) {
    this.conceptData.concepts.forEach(element => {
      element.concept = element.concept.replace(/`/g, "'");
      element.html = element.html.replace(/`/g, "'");
    });
    moveItemInArray(this.conceptData.concepts, event.previousIndex, event.currentIndex);
    console.log(event.previousIndex, event.currentIndex);
    let orderArray = [];
    this.conceptData.concepts.forEach(ele => {
      orderArray.push(JSON.stringify(ele.conceptid))
    });
    this._BsrService.postItOrder(this.projectId, orderArray).subscribe(arg => {
      this._BsrService.getPost().subscribe((res: any) => {
        this.conceptData = JSON.parse(res[0].bsrData);

        this.conceptData.concepts.forEach(element => {
          element.replace(/`/g, "'");
        });

        if (JSON.parse(res[0].bsrData).presentationtype === 'NSR') {
          this.isNSR = true;
        }
        console.log(this.conceptData);
      });

    });
  }

  dropped(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }


  // TOOLBAR MENU ACTIONS
  moveForward() {
    this.searchBoxLeftProperty = '611px;';
    this.appSearchSlidesData = [];
    this.isCommentBox = false;
    this.createPostIt = false;
    if (this.totalNumberOfSlides > this.currentPageNumber + 1) {
      this.currentPageNumber = 1 + this.currentPageNumber;
      this.slideBackground = this.baseBackgroundUrl + this.appSlidesData[this.currentPageNumber].SlideBGFileName + ')';
      if (this.postItPresentationIndex === this.currentPageNumber) {
        this.createPostIt = true;
        this.searchBoxLeftProperty = '777px';
      }
      this.pageCounter = this.currentPageNumber + 1 + '/' + this.totalNumberOfSlides;
      this.currentPageNumber+1 == this.SummarySlide?  this.createPostIt = true : this.createPostIt = false
    } else {
      this.goToSlide(this.currentPageNumber);
    }
  }


  moveBackward() {
    this.searchBoxLeftProperty = '611px;';
    this.appSearchSlidesData = [];
    this.isCommentBox = false;
    this.createPostIt = false
    if (this.currentPageNumber >= 1) {
      this.currentPageNumber = this.currentPageNumber - 1;
      this.pageCounter = this.currentPageNumber + 1 + '/' + this.totalNumberOfSlides;
      this.slideBackground = this.baseBackgroundUrl + this.appSlidesData[this.currentPageNumber].SlideBGFileName + ')';
      if (this.postItPresentationIndex === this.currentPageNumber) {
        this.createPostIt = true;
        this.searchBoxLeftProperty = '777px';
      }
      this.currentPageNumber+1 == this.SummarySlide?  this.createPostIt = true : this.createPostIt = false

    }
  }

  submitNewName() {

    this.loginForm.value.name.split(',').forEach(element => {
      this._BsrService.sendNewName(element, this.isNSR).subscribe(arg => {
      });
    });
    setTimeout(() => {
      this._BsrService.getNameCandidates(this.projectId).subscribe((res: any) => {
        this.nameCandidates = res;
      });
    }, 300);
  }

  newBlankPostIt() {
    let newConcepData = {
      projectId: this.projectId,
      conceptid: '0',
      concept: 'Concept',
      conceptorder: '0',
      attributes: [],
      names: []
    }
    this._BsrService.newPost(JSON.stringify(newConcepData)).subscribe(arg => {
      this._BsrService.getPost().subscribe((res: any) => {
        this.conceptData.concepts.forEach(element => {
          element.concept = element.concept.replace(/`/g, "'");
          element.html = element.html.replace(/`/g, "'");
        });
        this.conceptData = JSON.parse(res[0].bsrData);
      });
    });

  }

  wideScreenView(){
    this.wideView = !this.wideView
  }

  sideMenu() {
    this.overview = !this.overview;
  }

  home() {
    this.searchBoxLeftProperty = '611px;';
    this.pageCounter = '1/' + this.totalNumberOfSlides;
    this.slideBackground = this.baseBackgroundUrl + this.appSlidesData[0].SlideBGFileName + ')';
    this.createPostIt = false;
    this.currentPageNumber = 0;
    localStorage.setItem(this.projectName + '_namesIndexCounte', '0');
    localStorage.setItem(this.projectName + '_createPostIt', 'false');
  }

  bsr() {
    // reset search data
    this.appSearchSlidesData = [];
    this.mainMenu = false;
    this.createPostIt = !this.createPostIt;
    if (this.createPostIt) {
      this.searchBoxLeftProperty = '777px';
    } else {
      this.searchBoxLeftProperty = '611px;';
    }

    localStorage.setItem(this.projectName + '_createPostIt', this.createPostIt.toString());
    this.nameIndexCounter = parseInt(localStorage.getItem(this.projectName + '_namesIndexCounte'));
    this.onInputChange(parseInt(localStorage.getItem(this.projectName + '_namesBoxIndex')));
    this.currentPageNumber = this.postItPresentationIndex;
    this.pageCounter = this.postItPresentationIndex + 1 + '/' + this.totalNumberOfSlides;
    this.currentPageNumber = this.postItPresentationIndex;

  }

  displayCommentBox() {
    this.isCommentBox = !this.isCommentBox;
    (this.isCommentBox) ? this.getCommentsByIndex(this.currentPageNumber) : null;
  }

  comment() {

    if (this.isCommentBox) {

      let comment = this.projectId + "','" + this.currentPageNumber + "',N'" + this.commentBoxText + "'";

      this._BsrService.sendComment(comment).subscribe((res: any) => {

        let newConcepData = {
          projectId: this.projectId,
          conceptid: '-1',
          concept: 'Concept',
          conceptorder: '0',
          attributes: [],
          names: []
        }

        this._BsrService.newPost(JSON.stringify(newConcepData)).subscribe(arg => {
          this.conceptData = JSON.parse(arg[0].bsrData);
          let summayConceptId = '';
          this.conceptData.concepts.forEach(element => {
            if (element.concept === "SUMMARY" || element.concept === "summary") {
              summayConceptId = element.conceptid
            }
          });


          // SUMMIRIZE COMMENTS INTO A POST IT
          let comments = '';

          res.forEach(element => {
            comments += "<p>" + element.Comments + "<p>"
          });


          let newConcepData2 = {
            projectId: this.projectId,
            concept: 'SUMMARY',
            conceptid: '"' + summayConceptId + '"',
            attributesArray: '',
            namesArray: '',
            conceptHtml: comments
          }

          this._BsrService.updatePost(JSON.stringify(newConcepData2))
            .subscribe(arg => {

              this._BsrService.getPost().subscribe((res: any) => {
                this.conceptData = JSON.parse(res[0].bsrData);
                // this.conceptData.concepts[0].html = this.commentBoxText;
                this.conceptData.concepts.forEach(element => {
                  element.concept = element.concept.replace(/`/g, "'");
                  element.html = element.html.replace(/`/g, "'");
                });
                this.isCommentBox = false;
                this.commentBoxText = '';
              });

            });

        });

      });
    }
  }

  displayHelp(display: boolean) {
    (display) ? this._hotkeysService.cheatSheetToggle.next() : this._hotkeysService.cheatSheetToggle.next(display);
    this._hotkeysService.cheatSheetToggle.next(true)
  }

  goToSlide(i) {
    this.overview = false;
    this.currentPageNumber = i;


    if (this.postItPresentationIndex == this.currentPageNumber) {
      this.createPostIt = true;

    } else {
      this.slideBackground = this.baseBackgroundUrl + this.appSlidesData[i].SlideBGFileName + ')';

      this.createPostIt = false;
    }


    this.pageCounter = i + 1 + '/' + this.totalNumberOfSlides;
  }

  goToSlideFromSearch(i: string) {
    const ii = parseInt(i) - 1;
    this.slideBackground = this.baseBackgroundUrl + this.appSlidesData[ii].SlideBGFileName + ')';
    this.createPostIt = false;
    this.pageCounter = ii + 1 + '/' + this.totalNumberOfSlides;
  }

  openDialog(item, nameid): void {

    const dialogRef = this.dialog.open(editPost, {

      // width: ((nameid === 'edit')?'80%':'100%'),
      // height: ((nameid === 'edit') ? '777px' : '200px'),
      data: { name: item, nameId: nameid }
    });

    this.conceptid = item.conceptid;

    dialogRef.afterClosed().subscribe(result => {

      this.conceptData.concepts.forEach(element => {
        element.concept = element.concept.replace(/`/g, "'");
        element.html = element.html.replace(/`/g, "'");
      });

      if (result === 'delete') {
        if (this.conceptid === '-1') {
          this.conceptid = "'" + -1 + '"';
        }
        this._BsrService.deletePost(this.conceptid).subscribe(arg => {
          this._BsrService.getPost().subscribe((res: any) => {


            this.conceptData = JSON.parse(res[0].bsrData);
            this.conceptData.concepts.forEach(element => {
              element.concept = element.concept.replace(/`/g, "'");
              element.html = element.html.replace(/`/g, "'");
            });
            console.log(this.conceptData);
          });
        });
      } else if (result === 'deleteName') {
        this._BsrService.getNameCandidates(this.projectId).subscribe((res: any) => {
          this.nameCandidates = res;
        });
      } else if (result === 'savePost') {
        this._BsrService.getPost().subscribe((res: any) => {
          this.conceptData = JSON.parse(res[0].bsrData);
          this.conceptData.concepts.forEach(element => {
            element.concept = element.concept.replace(/`/g, "'");
            element.html = element.html.replace(/`/g, "'");
          });
          if (JSON.parse(res[0].bsrData).presentationtype === 'NSR') {
            this.isNSR = true;
          }
          console.log(this.conceptData);
        });
      }
      this._BsrService.getNameCandidates(this.projectId).subscribe((res: any) => {
        this.nameCandidates = res;
      });
    }
    );
  }


  assignCopy() {
    // this.appSearchSlidesData = Object.assign([], this.appSlidesData);
  }

  searchTerm(searchValue: string): void {

    if (!searchValue || searchValue === '') {
      this.appSearchSlidesData = [];
    } else {

      this.appSearchSlidesData = Object.assign([], this.appSlidesData).filter(
        item => item.SlideDescription.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
      )
    } // when nothing has typed
  }

  theme(): void {
    if (this.postItListTheme == 'post-it-list-theme') {
      this.postItListTheme = 'post-it-list'
    } else {
      this.postItListTheme = 'post-it-list-theme'
    }
    localStorage.setItem(this.projectName + '_post-it-list-theme', this.postItListTheme);
    let audio = new Audio();
    audio.src = "assets/sound/tap.wav";
    audio.volume = 0.02;
    audio.load();
    audio.play();
  }

  toggleNamebox() {
    // this.namesBoxIndex = parseInt(localStorage.getItem('namesBoxIndex'));
    if (this.namesBoxIndex === 0) {
      this.namesBoxIndex++;
      this.onInputChange(52);
    } else if (this.namesBoxIndex === 1) {
      this.namesBoxIndex++;
      this.onInputChange(30);
    } else {
      this.namesBoxIndex = 0;
      this.onInputChange(15);
    }

  }



  onInputChange(value: number) {
    // console.log("This is emitted as the thumb slides");
    // console.log(value);
    if (value > 51) {
      this.myMaxWith = '935px';
      this.myMaxRWith = '300px';
      this.myMaxRightWith = '-1px';
      this.nameBox = false;
      this.nameBoxB = false;
      this.isScreenButton = false;
    } else if (value <= 51 && value > 25) {
      this.myMaxWith = '925px';
      this.myMaxRWith = '340px';
      this.myMaxRightWith = '8px';
      this.nameBox = true;
      this.nameBoxB = true;
      this.isScreenButton = true;
    } else if (value <= 25) {
      this.myMaxWith = '335px';
      this.myMaxRWith = '636px';
      this.myMaxRightWith = '352px';
      this.nameBox = true;
      this.nameBoxB = false;
      this.isScreenButton = true;
    }
    this.namesBoxIndexValue = value;
    localStorage.setItem(this.projectName + '_namesBoxIndex', this.namesBoxIndexValue.toString());
  }


  screenNames() {
    this.isScreeningNames = !this.isScreeningNames;
  }

  toogleMenus() {
    this.mainMenu = !this.mainMenu;
  }

  openFullscreen() {
    this.elem = document.documentElement;
    this.isFullscreen = !this.isFullscreen;
    if (this.isFullscreen) {
      if (this.elem.requestFullscreen) {
        this.elem.requestFullscreen();
      } else if (this.elem.mozRequestFullScreen) {
        /* Firefox */
        this.elem.mozRequestFullScreen();
      } else if (this.elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.elem.webkitRequestFullscreen();
      } else if (this.elem.msRequestFullscreen) {
        /* IE/Edge */
        this.elem.msRequestFullscreen();
      }
    }
    else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      }
      else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }

  }


  setFontSize() {
    // console.log(this.font_size);
    this.font_size_text = this.font_size + 'px';
    localStorage.setItem(this.projectName + '_font_size_text', this.font_size_text);
    localStorage.setItem(this.projectName + '_font_size', this.font_size);
  }

}



import { MatSliderChange } from '@angular/material/slider';
import { ActivatedRoute } from '@angular/router';
import { ThrowStmt } from '@angular/compiler/src/output/output_ast';
import { DragulaService } from 'ng2-dragula';

// CKEDITOR WYSIWYG // **************************************************************************************************

export interface DialogData {
  nameId: any;
  name: any;
}


export interface PeriodicElement {
  synonyms: string;
  position: number;
  weight: number;
  symbol: string;
}




// POST EDITOR COMPONENT

@Component({
  selector: 'editPost',
  templateUrl: 'editPost-it.html',
  styleUrls: ['./bsr.component.scss']
})
export class editPost {

  ckconfig: any;
  synonyms: any;
  loginForm: FormGroup;
  isDeleting = false;
  isDeletingName = false;
  dataEditor = '<p>Hello, world!</p>';
  infoMessage = true;
  popupwindowData: { form: FormGroup; oldValue: string; };
  title: string;
  editName: string;
  concept: any;
  projectId = '';
  // projectId = 'rg2327';
  public model = {
    editorData: '',
    namesData: ''
  };


  newNamesPerConcept = ''
  conceptid = ''

  isMobileInfo: boolean;
  allComplete: boolean;
  isSynonymBox = false;
  isEmojiTime: boolean = false;

  displayedColumns: string[] = ['name', 'weight'];
  synonymWord: string = ' Copy name to clipboard ';
  dataSource: any[];
  public myAngularxQrCode: string = null;
  isQRcode: boolean;
  nameid: any = '';
  wideView: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<editPost>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private _formBuilder: FormBuilder, private _BsrService: BsrService, private activatedRoute: ActivatedRoute,) {
    this.editName = this.data.nameId;
    this.dataEditor = this.data.name.html;
    this.model.editorData = this.data.name.html;
    this.title = this.data.name.Name;

    if (this.data.name.names) {
      this.data.name.names.forEach(newName => {
        this.newNamesPerConcept += newName.name + '\n';
        this.nameid += newName.nameid + '\n';

      });
    }


    this.conceptid = this.data.name.conceptid;

    this.projectId = '';

    // assign a value
    // this.myAngularxQrCode = 'http://www.bipresents.com/'+ this.projectId;
    this.myAngularxQrCode = ' www.mynamepage.com/' + localStorage.getItem(this._BsrService.getProjectName() + '_projectName');
    if (this.data.name.Name) {
      this.concept = this.data.name.Name;
    } else {
      this.concept = this.data.name.concept;
      this.isDeletingName = true;
    }
    if (this.data.nameId === 'delete') {
      this.infoMessage = true;
      this.isDeleting = false;
      // this.isDeletingName = false;
    } else if (this.data.nameId === 'edit') {
      this.infoMessage = false;
      this.isDeleting = false;
    }
    else {
      this.infoMessage = true;
      this.isDeleting = false;
    }
    if (this.data.name === 'mobileInfo') {
      this.infoMessage = false;
      this.isDeleting = false;
      this.isMobileInfo = true;
    }
    if (this.data.name === 'qr_code') {
      this.infoMessage = false;
      this.isDeleting = false;
      this.isMobileInfo = false;
      this.isQRcode = true;
    }
    this.ckconfig = {
      allowedContent: false,
      width: '99.6%',
      contentsCss: ["body {font-size: 24px;}"],
      height: 380,
      forcePasteAsPlainText: true,
      toolbarLocation: 'top',
      toolbarGroups: [
        { name: 'clipboard', groups: ['clipboard', ''] },
        { name: 'insert' },
        { name: 'forms' },
        { name: 'tools' },
        { name: 'document', groups: ['mode', 'document', 'doctools'] },
        { name: 'others' },
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
        { name: 'colors' },
        { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'] },
        { name: 'styles' },
        { name: 'links' },
        { name: 'about' }
      ],
      addPlugins: 'simplebox,tabletools',
      removePlugins: 'horizontalrule,specialchar,about,others',
      removeButtons: 'Smiley,tableselection,Image,Superscript,Subscript,Save,NewPage,Preview,Print,Templates,Replace,SelectAll,Form,Checkbox,Radio,TextField,Textarea,Find,Select,Button,ImageButton,HiddenField,CopyFormatting,CreateDiv,BidiLtr,BidiRtl,Language,Flash,PageBreak,Iframe,ShowBlocks,Cut,Copy,Paste,Table,Format,Source,Maximize,Styles,Anchor,SpecialChar,PasteFromWord,PasteText,Scayt,RemoveFormat,Indent,Outdent,Blockquote'

    }
    this.loginForm = this._formBuilder.group({
      rationale: [''],
      suma: [''],
      name: [this.concept]
    });
  }


  buttonOption(option) {

    if (option === 'delete') {
      this.isDeleting = false;
      this.dialogRef.close('delete');
    }
    else if (option === 'savePost') {
      this.isDeleting = false;

      this.projectId = localStorage.getItem(this._BsrService.getProjectName() + '_projectId');

      let newConcepData = {
        projectId: this.projectId,
        concept: this.loginForm.value.name.replace(/'/g, "`"),
        conceptid: JSON.stringify(this.data.name.conceptid),
        attributesArray: this.data.name.attributes,
        namesArray: this.model.namesData.split("\n"),
        conceptHtml: this.model.editorData
      }
      this._BsrService.updatePost(JSON.stringify(newConcepData)).subscribe(arg => {
        this.dialogRef.close('savePost');
      });

    }
    else if (option === 'deleteName') {
      this.isDeleting = false;
      this._BsrService.deleteName(this.data.name.NameId).subscribe(arg => { });
      this.dialogRef.close('deleteName');
    } else {
      this.dialogRef.close('cancel');
    }
    // this.loginForm.value.suma.split('\n').forEach(element => {

    // this.newNamesPerConcept.replace(/'/g, "`");
    this.newNamesPerConcept.split('\n').forEach((element, index) => {
      const tempArray = this.nameid.split('\n');
      this._BsrService.sendNewName(element, false, this.conceptid, tempArray[index]).subscribe(arg => {
      });
    });

  }

  onNoClick(): void {
    this.popupwindowData = {
      form: this.loginForm,
      oldValue: this.data.name
    }
    this.dialogRef.close(this.popupwindowData);
  }

  async getSynonyms() {
    this.synonymWord = await navigator.clipboard.readText();

    this.isSynonymBox = true;
    this._BsrService.getSinonyms(this.synonymWord).subscribe((res: any) => {
      let counter = 0
      this.dataSource = [];
      res.forEach(synonym => {
        this.dataSource.push({ position: counter, synonyms: synonym.word, weight: 1.0079, symbol: 'H' })
        counter++;
      });
      console.log(res);
    })
  }

  setAll(evt) {
    this.model.editorData = this.model.editorData.concat('<p>' + evt + '</p>');
  }

  addSynonymsToEditor() {
    this.isSynonymBox = false;
    // this.model.editorData = this.model.editorData.concat('<p>' + this.dataSource[0].synonyms + '</p>');
  }
  emojiToggle() {
    this.isEmojiTime = !this.isEmojiTime;
  }



}
function toTop(nameid: any) {
  throw new Error('Function not implemented.');
}

