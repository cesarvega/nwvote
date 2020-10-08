import { Component, OnInit, Inject } from '@angular/core';
// import { NwvoteService } from '../../nw-vote/nwvote.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsrMobileService } from './bsr-mobile.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-bsr-mobile',
  templateUrl: './bsr-mobile.component.html',
  styleUrls: ['./bsr-mobile.component.scss']
})
export class BsrMobileComponent implements OnInit {

  isUserLogged = false;
  isUserLeaving = false;
  newNames = ['AJORSEK', 'EMPROVON', 'KALENPARQ', 'KAMLIO', 'ONBETYM', 'ONDEMUVE', 'ONPARNEX', 'PLUXONTI', 'TEYBILTON', 'VELZAGO'];
  userEmail;
  loginForm: FormGroup;
  newNameForm: FormGroup;
  projectname = ''
  property: any;
  projectId: any;
  username: any;
  wholeData: any;
  anoni: string = '';
  isEmojiTime = false;
  summarized: any;
  constructor(private _formBuilder: FormBuilder, private bsrService: BsrMobileService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router) {

    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['id'];
      this.bsrService.getProjectData(this.projectId).subscribe(arg => {
        this.projectname = JSON.parse(arg[0].bsrData).projectdescription;        
      });
    });


  }

  ngOnInit(): void {

    //clean local storage 
    localStorage.setItem('userTokenId', '');
    localStorage.setItem('project', '');
    localStorage.setItem('summarized', '');

    this.loginForm = this._formBuilder.group({
      email: ['cvega@brandinstitute.com', Validators.required],
      suma: [true],
      name: ['Cesar Vega', Validators.required]
    });

    this.newNameForm = this._formBuilder.group({
      suma: [false],
      name: ['', Validators.required]
    });

  }

  // for login view
  submitCredentials() {
    this.userEmail = this.loginForm.value.email;
    this.username = this.loginForm.value.name;
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
      }

      this.bsrService.sendName(nameTemp, this.anoni).subscribe(arg => {
        this.bsrService.login({ email: this.userEmail, name: this.username }, this.projectId).subscribe((res: any) => {
          this.newNames = JSON.parse('[' + res[0].Names + ']');
          this.isUserLogged = true;
        })
      });

    });

  }

  openDialog(item, nameid): void {
    const dialogRef = this.dialog.open(editName, {
      // width: '250px',
      data: { name: item, nameId: nameid }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        if (result.form.value.name && result.form.value.name !== 'delete') {

          this.bsrService.sendName(result.form.value.name, result.oldValue).subscribe(arg => {
            this.bsrService.login({ email: this.userEmail, name: this.username }, this.projectId).subscribe((res: any) => {
              this.newNames = JSON.parse('[' + res[0].Names + ']');
              this.isUserLogged = true;
            })
          });
        } else {
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
}
@Component({
  selector: 'edit-name',
  templateUrl: 'edit-name.html',
  styleUrls: ['./bsr-mobile.component.scss']
})
export class editName {
  loginForm: FormGroup;
  isDeleting = true;
  infoMessage = true;
  popupwindowData: { form: FormGroup; oldValue: string; };
  editName: string;
  constructor(
    public dialogRef: MatDialogRef<editName>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private _formBuilder: FormBuilder) {
    this.editName = this.data.name;
    if (this.data.name === 'displayInfo') {
      this.infoMessage = false;
    } else {
      this.infoMessage = true;
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

    if (option === 'save') {
      this.popupwindowData = {
        form: this.loginForm,
        oldValue: this.data.name
      }
      this.dialogRef.close(this.popupwindowData);
    }
    else if (option === 'delete') {

      if (this.isDeleting === false) {

        this.loginForm.value.name = 'delete';
        this.popupwindowData = {
          form: this.loginForm,
          oldValue: this.data.nameId
        }
        this.dialogRef.close(this.popupwindowData);
      }
      this.isDeleting = false;
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
