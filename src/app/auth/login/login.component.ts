import { Component, OnInit } from '@angular/core';
import { NwvoteService } from '../../nw-vote/nwvote.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';
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
    private router: Router, private msalService: MsalService, private http: HttpClient) { }

  ngOnInit(): void {
    this.msalService.handleRedirectObservable().subscribe((result) => {
      if (result && result.account) {
        this.msalService.instance.setActiveAccount(result.account);
      }
    });
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
      if (JSON.parse(res.d)[0].userToken) {        
        localStorage.setItem('username', JSON.parse(res.d)[0].username);
        localStorage.setItem('userTokenId', JSON.parse(res.d)[0].userToken);
        localStorage.setItem('project', this.projectname);
        this.router.navigate(['/', 'vote']);
      }

    })
  }
  
  signIn() {
    this.msalService.loginRedirect();
  }

  signOut() {
    this.msalService.logout();
  }

  async callGraphAPI() {
    const tokenResponse = await this.msalService.acquireTokenSilent({
      scopes: ['https://graph.microsoft.com/user.read'], // Replace with the required scopes
    }).toPromise();

    if (tokenResponse) {
      const headers = { Authorization: `Bearer ${tokenResponse.accessToken}` };
      this.http.get('https://graph.microsoft.com/v1.0/me', { headers }).subscribe((response) => {
        console.log(response);
      });
    }
  }

}
