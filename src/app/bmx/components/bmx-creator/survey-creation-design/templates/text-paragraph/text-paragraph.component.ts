import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BmxService } from '../../../bmx.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-text-paragraph',
  templateUrl: './text-paragraph.component.html',
  styleUrls: ['./text-paragraph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextParagraphComponent implements OnInit {
  @Input() bmxItem: any;
  @Input() i: number;
  @Input() bmxClientPageDesignMode: boolean;
  @Input() bmxClientPageOverview: boolean;
  @Input() currentPage: number;
  @Input() template: string;

  openSettings = false;
  projectName: string;
  previousText = '';
  editorConfig = {};

  constructor(private _bmxService: BmxService) { }

  ngOnInit(): void {
    this.editorConfig = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean']                                         // remove formatting button
      ]
    };
    this.previousText = this.bmxItem.componentText;
  }

  replaceBiI_Markers(): void {
    this.previousText = this.bmxItem.componentText;
    this._bmxService.currentprojectData$.subscribe((arg: any) => {
      if (!arg.bmxProjectName) {
        arg = JSON.parse(arg);
      }
      this.projectName = arg.bmxProjectName;

      this.bmxItem.componentText = this.bmxItem.componentText.replace('BI_PROJECTNAME', this.projectName);

      arg.bmxRegionalOffice.forEach((director: any, index: number) => {
        let directorString = `
          <div style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
            <div style="font-size: 23px;font-family: sofia-pro;line-height: 1.5">${director.name.trim()}</div>
            <div style="font-size: 18px;font-family: sofia-pro;line-height: 1.5">${director.title.trim()}</div>
            <div style="font-size: 18px;font-family: sofia-pro;line-height: 1.5">${director.email.trim()}</div>
            <div style="font-size: 18px;font-family: sofia-pro;line-height: 1.5">${director.phone.trim()}</div>
          </div><br>`;

        if (index <= 4) {
          this.bmxItem.componentText = this.bmxItem.componentText.replace(`BI_DIRECTOR${index}`, directorString);
        }
      });
    });
  }

  editTextWithEditor(): void {
    this.bmxItem.componentText = this.previousText;
  }
}
