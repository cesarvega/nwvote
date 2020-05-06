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
  newNames = ['AJORSEK', 'EMPROVON', 'KALENPARQ', 'KAMLIO', 'ONBETYM', 'ONDEMUVE', 'ONPARNEX', 'PLUXONTI', 'TEYBILTON', 'VELZAGO'];

  loginForm: FormGroup;
  projectname = ''
  property: any;
  projectId: any;
  constructor(private _formBuilder: FormBuilder, private bsrService:BsrMobileService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router) { 

     this.activatedRoute.params.subscribe(params => {
        this.projectId = params['id'];
        this.bsrService.getProjectData(this.projectId).subscribe(arg => {
          this.projectname = JSON.parse(arg[0].bsrData).projectdescription
        });
     });


    }

  ngOnInit(): void {

    //clean local storage 
    localStorage.setItem('userTokenId', '');
    localStorage.setItem('project', '');

    this.loginForm = this._formBuilder.group({
      email: ['', Validators.required],
      suma: [true],
      name: ['', Validators.required]
    });

  }

  submitCredentials() {
    this.bsrService.login(this.loginForm.value, this.projectId ).subscribe((res: any)=>{
      this.newNames = JSON.parse('[' + res[0].Names + ']');
      this.isUserLogged = true;
    })
  }

  openDialog(item): void {
    const dialogRef = this.dialog.open(editName, {
      // width: '250px',
      data: {name : item}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }



}

export interface DialogData {
  animal: string;
  name: string;
}
@Component({
  selector: 'edit-name',
  templateUrl: 'edit-name.html',
})
export class editName {
  loginForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<editName>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private _formBuilder: FormBuilder) { 
      console.log(this.data.name);
      this.loginForm = this._formBuilder.group({
        email: ['', Validators.required],
        suma: [''],
        name: [this.data.name]
      });
    }

  onNoClick(): void {
    console.log(this.data.name);
    
    this.dialogRef.close();
  }

  submitCredentials() {}

}
