import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BsrService } from './bsr.service';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';



@Component({
  selector: 'app-bsr',
  templateUrl: './bsr.component.html',
  styleUrls: ['./bsr.component.scss']
})
export class BsrComponent implements OnInit {

  @ViewChild('slider')slider;

  loginForm: FormGroup;
  valor: 51;
  projectId = 'rg2327';
  createPostIt = true;
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
    this._hotkeysService.add(new Hotkey('b', (event: KeyboardEvent): boolean => {
      // this.removeBackground();
      return false;
    }, undefined, 'Remove background'));
    this._hotkeysService.add(new Hotkey('s', (event: KeyboardEvent): boolean => {
      // this.timeToDisplayticker();
      return false;
    }, undefined, 'Show stock ticker'));
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
    this.createPostIt = false
    if (this.totalNumberOfSlides >= this.currentPageNumber) {
      this.pageCounter = this.currentPageNumber + '/' + this.totalNumberOfSlides;
      this.currentPageNumber = this.currentPageNumber + 1;
      this.slideBackground = this.baseBackgroundUrl + this.appSlidesData[this.currentPageNumber].SlideBGFileName + ')';
    }
  }

  moveBackward() {
    this.createPostIt = false
    if (this.currentPageNumber > 0) {
      this.pageCounter = this.currentPageNumber + '/' + this.totalNumberOfSlides;
      this.currentPageNumber = this.currentPageNumber - 1;
      this.slideBackground = this.baseBackgroundUrl + this.appSlidesData[this.currentPageNumber].SlideBGFileName + ')';
    }
  }

  submitNewName() {
    this._BsrService.sendNewName(this.loginForm.value.name, this.isNSR).subscribe(arg => {
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
    this.pageCounter = '1/' + this.totalNumberOfSlides;
    this.slideBackground = this.baseBackgroundUrl + this.appSlidesData[0].SlideBGFileName + ')';
    this.createPostIt = false
    console.log('home');
  }

  bsr() {
    this.createPostIt = !this.createPostIt;
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
      width: '100%',
      height: '800px',
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
    });
  }



  toggleNamebox() {
  //  this.nameBox = !this.nameBox;
  //  this.nameBoxB = !this.nameBoxB;
      this.showSlider =  !this.showSlider;
  }

  width = 400;
  height = 200;
  id = -1;
  onResize({ width, height }: NzResizeEvent): void {
    cancelAnimationFrame(this.id);
    this.id = requestAnimationFrame(() => {
      this.width = width!;
      this.height = height!;
    });
  }

  onInputChange(event: MatSliderChange) {
    console.log("This is emitted as the thumb slides");
    console.log(event.value);

    if (event.value > 51) {
      this.myMaxWith = '935px';
      this.myMaxRWith = '300px';
      this.myMaxRightWith = '-1px';
      this.nameBox =false;
      this.nameBoxB =false;
    }else if (event.value <= 51 && event.value > 25) {
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
    this.loginForm = this._formBuilder.group({
      rationale: [''],
      suma: [''],
      name: [this.concept]
    });

    this.Editor.defaultConfig = {
      toolbar: {
        items: [
          'heading',
          '|',
          'bold',
          'italic',
          'link',
          'bulletedList',
          'numberedList',
          'alignment',
          'blockQuote',
          'undo',
          'redo',
          'JustifyLeft',
          'JustifyCenter',
          'JustifyRight',
          'JustifyBlock',
          [ 'BulletedList', 'JustifyRight', 'JustifyLeft','Bold','Italic','Link', 'Unlink' ] 

          // "Source",
          // "Save",
          // "NewPage",
          // "DocProps",
          // "Preview",
          // "Print",
          // "Templates",
          // "document",
          // "Cut",
          // "Copy",
          // "Paste",
          // "PasteText",
          // "PasteFromWord",
          // "Undo",
          // "Redo",
          // "Find",
          // "Replace",
          // "SelectAll",
          // "Scayt",
          // "Form",
          // "Checkbox",
          // "Radio",
          // "TextField",
          // "Textarea",
          // "Select",
          // "Button",
          // "ImageButton",
          // "HiddenField",
          // "Bold",
          // "Italic",
          // "Underline",
          // "Strike",
          // "Subscript",
          // "Superscript",
          // "RemoveFormat",
          // "NumberedList",
          // "BulletedList",
          // "Outdent",
          // "Indent",
          // "Blockquote",
          // "CreateDiv",
          // "JustifyLeft",
          // "JustifyCenter",
          // "JustifyRight",
          // "JustifyBlock",
          // "BidiLtr",
          // "BidiRtl",
          // "Link",
          // "Unlink",
          // "Anchor",
          // "CreatePlaceholder",
          // "Image",
          // "Flash",
          // "Table",
          // "HorizontalRule",
          // "Smiley",
          // "SpecialChar",
          // "PageBreak",
          // "Iframe",
          // "InsertPre",
          // "Styles",
          // "Format",
          // "Font",
          // "FontSize",
          // "TextColor",
          // "BGColor",
          // "UIColor",
          // "Maximize",
          // "ShowBlocks",
          // "button1",
          // "button2",
          // "button3",
          // "oembed",
          // "MediaEmbed",
          // "About"
        ],   
             
      }
    }
    this.Editor.width =100;
    this.Editor.height =100;
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

  }

  onNoClick(): void {
    this.popupwindowData = {
      form: this.loginForm,
      oldValue: this.data.name
    }
    this.dialogRef.close(this.popupwindowData);
  }

}