import { Component, OnInit, Inject, HostBinding } from '@angular/core';
// import { NwvoteService } from '../../nw-vote/nwvote.service';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsrMobileService } from './bsr-mobile.service';
import {  MatDialog, MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-bsr-mobile',
  templateUrl: './bsr-mobile.component.html',
  styleUrls: ['./bsr-mobile.component.scss']
})
export class BsrMobileComponent implements OnInit {
  isMobile: boolean = false;
  isUserLogged = false;
  isUserLeaving = false;
  isBSROpen = false;
  newNames = [];
  userEmail;
  loginForm: UntypedFormGroup;
  newNameForm: UntypedFormGroup;
  projectName = ''
  property: any;
  projectId: any;
  username: any;
  wholeData: any;
  anoni: string = '';
  isEmojiTime = false;
  displayBulletPoints = false;
  bulletPointLine = '';
  summarized: any;
  deviceInfo: any;
  constructor(private _formBuilder: UntypedFormBuilder,private breakpointObserver: BreakpointObserver, private bsrService: BsrMobileService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router) {

    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['id'];
      localStorage.setItem('projectId',  this.projectId);
      this.bsrService.getProjectData(this.projectId).subscribe(arg => {
        this.projectName = JSON.parse(arg[0].bsrData).projectdescription;
        if(JSON.parse(arg[0].bsrData).presentationstatus !== 'OPEN'){
          this.isBSROpen = true;
          this.isUserLogged = false;
          this.isUserLeaving = false;
        }
        localStorage.setItem('projectName',  this.projectId);
        if(this.projectId== 'pa3930' || this.projectId== 'st3929'){
          this.displayBulletPoints = true;
          if (this.projectId== 'pa3930'){
            this.bulletPointLine = 'Name must end with -melanant (i.e. cesamelanant)';
          }
          if (this.projectId== 'st3929'){
            this.bulletPointLine = 'Name must end with -sotine (i.e. cesasotine)';
          }
        }
      });
    });
  }

  ngOnInit(): void {
    //clean local storage
    localStorage.setItem('userTokenId', '');
    localStorage.setItem('project', '');
    localStorage.setItem('summarized', '');

    this.userEmail = localStorage.getItem('userEmail');
    this.username = localStorage.getItem('username');

    this.loginForm = this._formBuilder.group({
      email: [ this.userEmail, Validators.required],
      suma: [true],
      name: [this.username, Validators.required]
    });

    this.newNameForm = this._formBuilder.group({
      suma: [false],
      name: ['', Validators.required]
    });

    this.breakpointObserver.observe(['(max-width: 599px)'])
    .subscribe(result => {
      this.isMobile = result.matches;
    });
    // setTimeout(() => {
    //   this.submitCredentials()
    //   setTimeout(() => {
    //     this.finish();
    //     setTimeout(() => {
    //       location.reload();
    //     }, 50000);
    //   }, 700000);
    // }, 30000);


  }

  // for login view
  submitCredentials() {
    this.userEmail = this.loginForm.value.email;
    localStorage.setItem('userEmail', this.userEmail);
    this.username = this.loginForm.value.name;
    localStorage.setItem('username', this.username);
    this.summarized = this.loginForm.value.suma;
    localStorage.setItem('summarized', this.summarized.toString());
    this.bsrService.login(this.loginForm.value, this.projectId).subscribe((res: any) => {
      if (res.length !== 0) {
        this.newNames = JSON.parse('[' + res[0].Names + ']');
      }
      this.isUserLogged = true;
    })
  }


  sendNewName() {
    this.newNameForm.value.name.split(',').forEach(splittedName => {
      let nameTemp = splittedName;
      this.newNameForm.value.name = '';

      if (this.newNameForm.value.suma) {
        this.anoni = 'Anonymous';
      }else {
        this.anoni = '';
      }

      this.bsrService.sendName(nameTemp, '','','',this.anoni).subscribe(arg => {
        this.bsrService.login({ email: this.userEmail, name: this.username }, this.projectId).subscribe((res: any) => {
          this.newNames = JSON.parse('[' + res[0].Names + ']');
          this.isUserLogged = true;
        })
      });

    });

  }

  openDialog(item, nameid, rationale, favourite,source): void {
    const dialogRef = this.dialog.open(editName, {
      // width: '250px',
      data: {
          name: item,
          nameId: nameid,
          rationale: rationale,
          favourite: favourite,
          source: source,
         }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        if (result.form.value.name && result.form.value.name === 'like') {

          this.bsrService.sendName(result.form.value.name, result.oldValue,
            result.form.value.rationale, result.form.value.favourite,result.form.value.source).subscribe(arg => {
            this.bsrService.login({ email: this.userEmail, name: this.username }, this.projectId).subscribe((res: any) => {
              this.newNames = JSON.parse('[' + res[0].Names + ']');
              this.isUserLogged = true;
            })
          });
        }
        else if (result.form.value.name && result.form.value.name !== 'delete') {

          this.bsrService.sendName(result.form.value.name, result.oldValue,
            result.form.value.rationale, result.form.value.favourite,result.form.value.source).subscribe(arg => {
            this.bsrService.login({ email: this.userEmail, name: this.username }, this.projectId).subscribe((res: any) => {
              this.newNames = JSON.parse('[' + res[0].Names + ']');
              this.isUserLogged = true;
            })
          });
        }

        else {
          this.bsrService.deleteName(result.oldValue).subscribe(arg => {
            this.bsrService.login({ email: this.userEmail, name: this.username }, this.projectId).subscribe((res: any) => {
              this.newNames = JSON.parse('[' + res[0].Names + ']');
              this.isUserLogged = true;
            })
          });

        }
      }

    });
  }

  finish() {
    this.isUserLogged = false;
    this.isUserLeaving = true;
    this.bsrService.goToLogout().subscribe(res => {
      console.log(res);

    })
  }

  reloadpage() {
    location.reload();
  }
  emojiToggle(){
    this.isEmojiTime = !this.isEmojiTime;
  }


  closeEmoji(): void {
    this.isEmojiTime = false;
    }


}


// POPUP EDIT NAME WINDOW

export interface DialogData {
  nameId: string;
  name: string;
  rationale: string;
  favourite: string;
  source: string;
}
@Component({
  selector: 'edit-name',
  templateUrl: 'edit-name.html',
  styleUrls: ['./bsr-mobile.component.scss']
})
export class editName {

  loginForm: UntypedFormGroup;
  isDeleting = true;
  infoMessage = true;
  popupwindowData: { form: UntypedFormGroup; oldValue: string; };
  editName: string;
  favourite: boolean;
  source: string;
  // @HostBinding('attr.role') role = 'admin';

  constructor(
    public dialogRef: MatDialogRef<editName>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private _formBuilder: UntypedFormBuilder) {



    this.editName = this.data.name;
    this.source = this.data.source;
    this.favourite = (this.data.favourite==='true')?true:false;

    if (this.data.name === 'displayInfo') {
      this.infoMessage = false;
    } else {
      this.infoMessage = true;
      console.log(this.data.name);
      this.loginForm = this._formBuilder.group({
        rationale: [this.data.rationale],
        name: [this.data.name],
        favourite: [this.data.favourite],
        source: [this.data.source],
      });
    }

  }

  onNoClick(): void {
    console.log(this.data.name);
    this.popupwindowData = {
      form: this.loginForm,
      oldValue: this.data.name,
    }
    this.dialogRef.close(this.popupwindowData);
  }

  buttonOption(option) {

    if (option === 'save') {
      this.popupwindowData = {
        form: this.loginForm,
        oldValue: this.data.name,
      }
      this.dialogRef.close(this.popupwindowData);
    }
    else if (option === 'delete') {

      if (this.isDeleting === false) {

        this.loginForm.value.name = 'delete';
        this.popupwindowData = {
          form: this.loginForm,
          oldValue: this.data.nameId,
        }
        this.dialogRef.close(this.popupwindowData);
      }
      this.isDeleting = false;
    }
    else if (option === 'like') {

        this.loginForm.value.favourite =  !this.favourite;
        this.popupwindowData = {
          form: this.loginForm,
          oldValue: this.data.name,
        }
        this.dialogRef.close(this.popupwindowData);

    }
    else if (option === 'dismiss') {
      this.dialogRef.close(this.popupwindowData);
      this.isDeleting = true;
    }
    else {
      this.isDeleting = true;
    }

  }

}
