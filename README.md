# BMX sompile issues sugested fixes

Setting NODE_OPTIONS=--openssl-legacy-provider is a way to configure Node.js to use the legacy provider for OpenSSL. This is often used as a workaround when you encounter issues related to SSL/TLS in your Node.js application, especially if those issues are due to incompatibilities with newer versions of OpenSSL. 

Here's how you can do it based on your operating system:

Windows
To set the NODE_OPTIONS environment variable to use the OpenSSL legacy provider on Windows, you can use the Command Prompt (cmd) or PowerShell. Here's how to do it in both:

set NODE_OPTIONS=--openssl-legacy-provider

Also if you intall node modules and if failed try

npm install --legacy-peer-deps

then

npm install --force


# NW-Vote, BSR desktop , and BSR mobile 

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
