import { Component, OnInit, inject, Inject } from '@angular/core';
import {  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  htmlString;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.htmlString = this.sanitizer.bypassSecurityTrustHtml(this.data.email
      
    )
  }

}
