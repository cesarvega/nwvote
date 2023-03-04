import { Component, OnInit } from '@angular/core';
import { NwvoteService } from '../../nw-vote/nwvote.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  projectname =''
  constructor(private _formBuilder: FormBuilder,
    public _NwvoteService: NwvoteService,private activatedRoute: ActivatedRoute,
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
    this.projectname = this.activatedRoute.snapshot.queryParamMap.get('project');
  }

  submitCredentials(){
    this._NwvoteService.login(this.loginForm.value, this.projectname ).subscribe((res: any)=>{
      if (JSON.parse(res.d)[0]) {
        localStorage.setItem('username', JSON.parse(res.d)[0].username);
        localStorage.setItem('userTokenId', JSON.parse(res.d)[0].userToken);
        localStorage.setItem('project', this.projectname);
        this.router.navigate(['/', 'vote']);
      }

    })
  }

}
