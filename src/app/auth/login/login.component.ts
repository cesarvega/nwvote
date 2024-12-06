import { Component, inject, OnInit } from '@angular/core';
import { NwvoteService } from '../../nw-vote/nwvote.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';
import { AuthenticationResult } from '@azure/msal-browser';
import { BMX_STORE } from 'src/app/signals/+store/brs.store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  projectname = '';
  readonly bmxStore = inject(BMX_STORE);

  constructor(
    private _formBuilder: FormBuilder,
    public _NwvoteService: NwvoteService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private msalService: MsalService,
    private http: HttpClient
  ) {
    this.msalService.initialize().subscribe(res => {
      this.signOutAll()
    })
  }

  ngOnInit(): void {
    // Clean local storage
    localStorage.setItem('userTokenId', '');
    localStorage.setItem('project', '');
 
    this.loginForm = this._formBuilder.group({
      email: ['', Validators.required],
      suma: [''],
      name: ['', Validators.required]
    });

    this.projectname = this.activatedRoute.snapshot.queryParamMap.get('project') || '';
  }

  submitCredentials() {
    this._NwvoteService.login(this.loginForm.value, this.projectname).subscribe((res: any) => {
      const user = JSON.parse(res.d)[0];
      if (user.userToken) {
        localStorage.setItem('username', user.username);
        localStorage.setItem('userTokenId', user.userToken);
        localStorage.setItem('project', this.projectname);
        this.router.navigate(['/', 'vote']);
      }
    });
  }

  async signInMicrosoft() {
    sessionStorage.clear()
    await this.msalService.loginPopup().subscribe( async (response: AuthenticationResult) => {
      await this.msalService.instance.setActiveAccount(response.account)
      localStorage.setItem('userData', JSON.stringify(response.account))
      this.bmxStore.updateUserData(JSON.stringify(response.account))

      localStorage.setItem('userGui', JSON.stringify(response.account))
      this.bmxStore.updateUserGui(JSON.stringify(response.account))

      this.router.navigate(['/dashboard']);
      sessionStorage.clear()
    })
  }

  async handleLoginRedirectCallback() {
    const response = await this.msalService.instance.handleRedirectPromise();
    return response;
  }

  signOut() {
    this.msalService.logout();
  }

  async callGraphAPI() {
    const tokenResponse = await this.msalService.acquireTokenSilent({
      scopes: ['https://graph.microsoft.com/user.read'],
    }).toPromise();

    if (tokenResponse) {
      const headers = { Authorization: `Bearer ${tokenResponse.accessToken}` };
      this.http.get('https://graph.microsoft.com/v1.0/me', { headers }).subscribe((response) => {
        console.log(response);
      });
    }
  }
  async signOutAll() {
    const accounts = this.msalService.instance.getAllAccounts();
    for (const account of accounts) {
      try {
        await this.msalService.instance.logoutRedirect({
          account: account,
          postLogoutRedirectUri: window.location.origin
        });
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
  }

}
