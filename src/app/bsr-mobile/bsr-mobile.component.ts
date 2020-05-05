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

  isUserLogged = true;
  newNames = ['AJORSEK', 'EMPROVON', 'KALENPARQ', 'KAMLIO', 'ONBETYM', 'ONDEMUVE', 'ONPARNEX', 'PLUXONTI', 'TEYBILTON', 'VELZAGO'];

  loginForm: FormGroup;
  projectname = ''
  constructor(private _formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private _BsrMobileService: BsrMobileService,public dialog: MatDialog,
    private router: Router) { }

  ngOnInit(): void {

    //clean local storage 
    localStorage.setItem('userTokenId', '');
    localStorage.setItem('project', '');

    this.loginForm = this._formBuilder.group({
      email: ['', Validators.required],
      suma: [''],
      name: ['', Validators.required]
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.projectname = params['project'];

    });

  }

  submitCredentials() {
    // this._NwvoteService.login(this.loginForm.value, this.projectname ).subscribe((res: any)=>{
    //   if (JSON.parse(res.d)[0].userToken) {        
    //     localStorage.setItem('username', JSON.parse(res.d)[0].username);
    //     localStorage.setItem('userTokenId', JSON.parse(res.d)[0].userToken);
    //     localStorage.setItem('project', this.projectname);
    //     this.router.navigate(['/', 'vote']);
    //   }

    // })
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(editName, {
      width: '250px',
      data: {}
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

  constructor(
    public dialogRef: MatDialogRef<editName>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
