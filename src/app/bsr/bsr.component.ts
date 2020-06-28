import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BsrService } from './bsr.service';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-bsr',
  templateUrl: './bsr.component.html',
  styleUrls: ['./bsr.component.scss']
})
export class BsrComponent implements OnInit {
  timePeriods = [
    'Bronze age',
    'Iron age',
    'Middle ages',
    'Early modern period',
    'Long nineteenth century'
  ];
  // public dialog: MatDialog;
  createPostIt = true;
  overview = false;
  slideBackground = 'background-image: url(http://www.bipresents.com/';
  baseBackgroundUrl = 'background-image: url(http://www.bipresents.com/';
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  totalNumberOfSlides;
  pageCounter = ' 1/40';
  currentPageNumber = 0;
  appSlidesData: any;
  mainMenu: boolean;
  constructor(private _hotkeysService: HotkeysService, private _BsrService: BsrService, public dialog: MatDialog) {

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
      this._hotkeysService.cheatSheetToggle.next(true);
      return false;
    }, undefined, 'Hide help sheet'));` v cccddddvcf  b`
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
    this._BsrService.getNewNames('te2381').subscribe((res: any) => {
      console.log(res);
      this.appSlidesData = res;
      localStorage.setItem('appSlideData', JSON.stringify(res));
      this.totalNumberOfSlides = res.length
      this.pageCounter = '1/' + this.totalNumberOfSlides;
      this.slideBackground = this.slideBackground + res[0].SlideBGFileName + ')';
      this.currentPageNumber = 1;
    })
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.timePeriods, event.previousIndex, event.currentIndex);
    console.log(event.previousIndex, event.currentIndex);


  }
  entered(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.timePeriods, event.previousIndex, event.currentIndex);
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

  postIts() {

    console.log('postIts');
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
      // width: '250px',
      data: { name: item, nameId: nameid }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result.form.value.name && result.form.value.name !== 'delete') {

        // this.bsrService.sendName(result.form.value.name, result.oldValue).subscribe(arg => {
        //   this.bsrService.login({ email: this.userEmail, name: this.username }, this.projectId).subscribe((res: any) => {
        //     this.newNames = JSON.parse('[' + res[0].Names + ']');
        //     this.isUserLogged = true;
        //   })
        // });
      } else {
        // this.bsrService.deleteName(result.oldValue).subscribe(arg => {
        //   this.bsrService.login({ email: this.userEmail, name: this.username }, this.projectId).subscribe((res: any) => {
        //     this.newNames = JSON.parse('[' + res[0].Names + ']');
        //     this.isUserLogged = true;
        //   })
        // });

      }

    });
  }

}


export interface DialogData {
  nameId: string;
  name: string;
}
@Component({
  selector: 'editPost',
  templateUrl: 'editPost-it.html',
})
export class editPost {
  loginForm: FormGroup;
  isDeleting = false;
  infoMessage = true;
  popupwindowData: { form: FormGroup; oldValue: string; };
  editName: string;
  constructor(
    public dialogRef: MatDialogRef<editPost>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private _formBuilder: FormBuilder) {
    this.editName = this.data.name;
    if (this.data.nameId === 'delete') {
      this.infoMessage = true;
      this.isDeleting = false;
    } else {
      this.infoMessage = false;
      this.isDeleting = false;
      console.log(this.data.name);
      this.loginForm = this._formBuilder.group({
        rationale: [''],
        suma: [''],
        name: [this.data.name]
      });
    }
  }

  onNoClick(): void {
    console.log(this.data.name);

    this.popupwindowData = {

      form: this.loginForm,
      oldValue: this.data.name

    }

    this.dialogRef.close(this.popupwindowData);
  }

  buttonOption(option) {

    if (option === 'delete') {
        this.isDeleting = false;
        this.dialogRef.close(this.popupwindowData);
      }
  
      else {
        this.isDeleting = false;
        this.dialogRef.close(this.popupwindowData);
      }
  
    }

}