import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BsrService } from './bsr.service';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';



// import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';

// import HeadingButtonsUI from '@ckeditor/ckeditor5-heading/src/headingbuttonsui';

// import ParagraphButtonUI from '@ckeditor/ckeditor5-paragraph/src/paragraphbuttonui';


@Component({
  selector: 'app-bsr',
  templateUrl: './bsr.component.html',
  styleUrls: ['./bsr.component.scss']
})
export class BsrComponent implements OnInit {

  @ViewChild('slider') slider;

  loginForm: FormGroup;
  sliderVal = 51;
  totalNumberOfnames = 51;
  slideCss = 'none';
  projectId = 'rg2327';
  createPostIt = false;
  isSearching = false;
  overview = false;
  isNSR = false;
  slideBackground = 'background-image: url(http://www.bipresents.com/';
  baseBackgroundUrl = 'background-image: url(http://www.bipresents.com/';
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  totalNumberOfSlides: any;
  pageCounter = ' 1/40';
  currentPageNumber = 0;
  appSlidesData: any;
  mainMenu: boolean;
  conceptData: any;
  newPost: Object;
  newName: any;
  conceptid: any;
  deletePost: Object;
  nameCandidates: any;
  nameBox = true;
  nameBoxB = true;
  myMaxWith = '900px';
  myMaxRWith = '900px';
  myMaxRightWith = '8px';
  showSlider: boolean = false;
  positPresentationIndex: number;
  appSearchSlidesData: any;
  constructor(private _formBuilder: FormBuilder, private _hotkeysService: HotkeysService, private _BsrService: BsrService, public dialog: MatDialog) {

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
      return false;
    }, undefined, 'Hide help sheet'));
    this._hotkeysService.add(new Hotkey('shift+r', (event: KeyboardEvent): boolean => {
      // if (this.vote === true) {
      //   this.vote = false;
      // } else {
      //   this.vote = true;
      // }
      return false;
    }, undefined, ''));
  }

  ngOnInit(): void {
    this._BsrService.getSlides(this.projectId).subscribe((res: any) => {
      console.log(res);
      this.appSlidesData = res;
      this.appSearchSlidesData = res;
      localStorage.setItem('appSlideData', JSON.stringify(res));
      this.totalNumberOfSlides = res.length
      this.pageCounter = '1/' + this.totalNumberOfSlides;
      this.slideBackground = this.slideBackground + res[0].SlideBGFileName + ')';
      this.currentPageNumber = 1;
    })

    this._BsrService.getPost().subscribe((res: any) => {
      this.conceptData = JSON.parse(res[0].bsrData);
      if (JSON.parse(res[0].bsrData).presentationtype = 'NSR') {
        this.isNSR = true;
      }
      console.log(this.conceptData);
    });

    this._BsrService.getNameCandidates(this.projectId).subscribe((res: any) => {
      this.nameCandidates = res;
    });
    this.loginForm = this._formBuilder.group({
      rationale: [''],
      suma: [''],
      name: ['']
    });

    this.slider.value = 51;
    this.slideCss = 'block';
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.conceptData.concepts, event.previousIndex, event.currentIndex);
    console.log(event.previousIndex, event.currentIndex);
    let orderArray = [];
    this.conceptData.concepts.forEach(ele => {
      orderArray.push(JSON.stringify(ele.conceptid))
    });
    this._BsrService.postItOrder(this.projectId, orderArray).subscribe(arg => {

      this._BsrService.getPost().subscribe((res: any) => {
        this.conceptData = JSON.parse(res[0].bsrData);
        if (JSON.parse(res[0].bsrData).presentationtype = 'NSR') {
          this.isNSR = true;

        }
        console.log(this.conceptData);
      });

    });

  }
  entered(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.conceptData.concepts, event.previousIndex, event.currentIndex);
    console.log(event.previousIndex, event.currentIndex);
  }


  // TOOLBAR MENU ACTIONS 
  moveForward() {
    this.createPostIt = false;
    if (this.totalNumberOfSlides >= this.currentPageNumber) {
      this.pageCounter = this.currentPageNumber + '/' + this.totalNumberOfSlides;
      this.currentPageNumber = this.currentPageNumber + 1;
      this.slideBackground = this.baseBackgroundUrl + this.appSlidesData[this.currentPageNumber].SlideBGFileName + ')';
      if (this.appSlidesData[this.currentPageNumber].SlideType === "NameSummary") {
        this.positPresentationIndex = this.currentPageNumber;
        this.createPostIt = true;
      }
    }
  }

  moveBackward() {
    this.createPostIt = false
    if (this.currentPageNumber > 0) {
      this.pageCounter = this.currentPageNumber + '/' + this.totalNumberOfSlides;
      this.currentPageNumber = this.currentPageNumber - 1;
      this.slideBackground = this.baseBackgroundUrl + this.appSlidesData[this.currentPageNumber].SlideBGFileName + ')';
      if (this.appSlidesData[this.currentPageNumber].SlideType === "NameSummary") {
        this.positPresentationIndex = this.currentPageNumber;
        this.createPostIt = true;
      }
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
        this.conceptData = JSON.parse(res[0].bsrData);
      });
    });

  }

  sideMenu() {
    this.overview = !this.overview;
    console.log('overview');
  }

  mobileInstruccions() {

    console.log('mobileInstruccions');
  }

  home() {
    this.currentPageNumber = 1;
    this.pageCounter = '1/' + this.totalNumberOfSlides;
    this.slideBackground = this.baseBackgroundUrl + this.appSlidesData[0].SlideBGFileName + ')';
    this.createPostIt = false
    console.log('home');
  }

  bsr() {
    this.createPostIt = !this.createPostIt;
    this.currentPageNumber = (this.positPresentationIndex)?this.positPresentationIndex:58;
    console.log('bsr');
  }

  comment() {

    console.log('comment');
  }


  displayHelp(display: boolean) {
    (display) ? this._hotkeysService.cheatSheetToggle.next() : this._hotkeysService.cheatSheetToggle.next(display);
    this._hotkeysService.cheatSheetToggle.next(true)
  }


  goToSlide(i) {
    this.slideBackground = this.baseBackgroundUrl + this.appSlidesData[i].SlideBGFileName + ')';
    this.createPostIt = false
    console.log('slide ' + i);
  }

  openDialog(item, nameid): void {
   
 
      const dialogRef = this.dialog.open(editPost, {
        // width: ((nameid === 'edit')?'80%':'100%'),
        height: ((nameid === 'edit')?'700px':'200px'),
        data: { name: item, nameId: nameid }
      });
    

    this.conceptid = item.conceptid;

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'delete') {
        this._BsrService.deletePost(this.conceptid).subscribe(arg => {
          this._BsrService.getPost().subscribe((res: any) => {
            this.conceptData = JSON.parse(res[0].bsrData);
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
          if (JSON.parse(res[0].bsrData).presentationtype = 'NSR') {
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



  toggleNamebox() {
    //  this.nameBox = !this.nameBox;
    //  this.nameBoxB = !this.nameBoxB;
    this.showSlider = !this.showSlider;
    if (this.showSlider) {
      this.slideCss = 'block';
    } else {
      this.slideCss = 'none';
    }
  }



  onInputChange(event: MatSliderChange) {
    console.log("This is emitted as the thumb slides");
    console.log(event.value);

    if (event.value > 51) {
      this.myMaxWith = '935px';
      this.myMaxRWith = '300px';
      this.myMaxRightWith = '-1px';
      this.nameBox = false;
      this.nameBoxB = false;
    } else if (event.value <= 51 && event.value > 25) {
      this.myMaxWith = '925px';
      this.myMaxRWith = '293px';
      this.myMaxRightWith = '8px';
      this.nameBox = true;
      this.nameBoxB = true;
    } else if (event.value <= 25) {
      this.myMaxWith = '335px';
      this.myMaxRWith = '636px';
      this.myMaxRightWith = '322px';
      this.nameBox = true;
      this.nameBoxB = false;

    }
  }

  searchTerm(searchValue: string): void {
    if (searchValue.length == 0) {
      this.isSearching = false;
      this.appSearchSlidesData = [];
    } else {
 
      
      this.isSearching = true;
           
      this.appSlidesData.forEach(element => {
        if ( element.DisplayName.includes(searchValue)) {
         this.appSearchSlidesData.push(element);
        }
       });
    }




    console.log(searchValue);
  }



}



import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatSliderChange } from '@angular/material/slider';



// CKEDITOR WYSIWYG // **************************************************************************************************

export interface DialogData {
  nameId: any;
  name: any;
}

@Component({
  selector: 'editPost',
  templateUrl: 'editPost-it.html',
  styleUrls: ['./bsr.component.scss']
})
export class editPost {
  name = 'Angular 6';

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
    ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

  public Editor = ClassicEditor;

  synonyms
  loginForm: FormGroup;
  isDeleting = false;
  isDeletingName = false;
  dataEditor = '<p>Hello, world!</p>';
  infoMessage = true;
  popupwindowData: { form: FormGroup; oldValue: string; };
  title: string;
  editName: string;
  concept: any;
  projectId = 'rg2327';
  public model = {
    editorData: '',
    namesData: ''
  };
  isMobileInfo: boolean;
  constructor(
    public dialogRef: MatDialogRef<editPost>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private _formBuilder: FormBuilder, private _BsrService: BsrService,) {
    this.editName = this.data.nameId;
    this.dataEditor = this.data.name.html;
    this.model.editorData = this.data.name.html;
    this.title = this.data.name.Name;

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


    this.loginForm = this._formBuilder.group({
      rationale: [''],
      suma: [''],
      name: [this.concept]
    });

    // this.Editor.defaultConfig = {
    //   toolbarGroups: [
    //     { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
    //     { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
    //     { name: 'editing', groups: [ 'find', 'selection', 'spellchecker' ] },
    //     { name: 'forms' },
    //     '/',
    //     { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
    //     { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
    //     { name: 'links' },
    //     { name: 'insert' },
    //     '/',
    //     { name: 'styles' },
    //     { name: 'colors' },
    //     { name: 'tools' },
    //     { name: 'others' },
    //     { name: 'about' }
    //   ],
    //   toolbar : [
    //     { name: 'document', groups: [ 'mode', 'document', 'doctools' ], items: [ 'Source', '-', 'Save', 'NewPage', 'ExportPdf', 'Preview', 'Print', '-', 'Templates' ] },
    //     { name: 'clipboard', groups: [ 'clipboard', 'undo' ], items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
    //     { name: 'editing', groups: [ 'find', 'selection', 'spellchecker' ], items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] },
    //     { name: 'forms', items: [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ] },
    //     '/',
    //     { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat' ] },
    //     { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ] },
    //     { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
    //     { name: 'insert', items: [ 'Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe' ] },
    //     '/',
    //     { name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
    //     { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
    //     { name: 'tools', items: [ 'Maximize', 'ShowBlocks' ] },
    //     { name: 'others', items: [ '-' ] },
    //     { name: 'about', items: [ 'About' ] }
    //   ]
    // }
    // this.Editor.width =100;
    // this.Editor.height =100;
  }


  onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  buttonOption(option) {

    if (option === 'delete') {
      this.isDeleting = false;
      this.dialogRef.close('delete');
    }
    else if (option === 'savePost') {
      this.isDeleting = false;



      let newConcepData = {
        projectId: this.projectId,
        concept: this.loginForm.value.name,
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
    this.loginForm.value.suma.split('\n').forEach(element => {
      this._BsrService.sendNewName(element, false).subscribe(arg => {
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

  getSinonyms(syn){
    this._BsrService.getSinonyms('one').subscribe(res=>{
      console.log(res);
      
    })
  }

}