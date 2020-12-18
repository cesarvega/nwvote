# NwVote

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

NW Vote app and BSR desktop and mobile app versions 


## Further help

Uncomment paths to make each app functions 
 // {// NW Vote 
  //   path: 'login',
  //   component: LoginComponent
  // },
  // {
  //   path: 'vote',
  //   component: NwVoteComponent
  // },
  {// BSR-Mobile
    path: ':id',

    component: BsrMobileComponent
  },
  // {//BSR
  //   path: ':id',
  //   component: BsrComponent
  // },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
