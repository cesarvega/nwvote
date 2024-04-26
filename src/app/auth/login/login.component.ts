import { Component, OnInit } from '@angular/core';
import { NwvoteService } from '../../nw-vote/nwvote.service';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: UntypedFormGroup;
  projectname = ''
  constructor(private _formBuilder: UntypedFormBuilder,
    public _NwvoteService: NwvoteService, private activatedRoute: ActivatedRoute,
    private router: Router,  private http: HttpClient) { }

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
    this.handleLoginRedirectCallback().then((response) => {
      // if (response !== null) {
      //   this.msalService.instance.setActiveAccount(response.account)
      //    this.router.navigate(['/bmx', '99CB72BF-D163-46A6-8A0D-E1531EC7FEDC']);
      // }
    });

  }

  submitCredentials() {
    console.log(this.projectname)
    this._NwvoteService.login(this.loginForm.value, this.projectname).subscribe((res: any) => {
      console.log(res)
      if (JSON.parse(res.d)[0].userToken) {
        localStorage.setItem('username', JSON.parse(res.d)[0].username);
        localStorage.setItem('userTokenId', JSON.parse(res.d)[0].userToken);
        localStorage.setItem('project', this.projectname);
        this.router.navigate(['/', 'vote']);
      }

    })
  }
  signInMicrosoft() {
    // this.msalService.loginRedirect()
  }

  async handleLoginRedirectCallback() {
    // const response = await this.msalService.instance.handleRedirectPromise();
    // return response
  }

  signOut() {
    // this.msalService.logout();
  }

  // async callGraphAPI() {
  //   const tokenResponse = await this.msalService.acquireTokenSilent({
  //     scopes: ['https://graph.microsoft.com/user.read'],
  //   }).toPromise();

    if (tokenResponse) {
      const headers = { Authorization: `Bearer ${tokenResponse.accessToken}` };
      this.http.get('https://graph.microsoft.com/v1.0/me', { headers }).subscribe((response) => {
        console.log(response);
      });
    }
  }


