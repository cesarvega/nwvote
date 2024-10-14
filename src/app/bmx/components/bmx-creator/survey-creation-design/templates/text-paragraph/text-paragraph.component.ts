import { Component, Input, OnInit, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
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
  @Input() bmxPages
  @Input() currentPage
  @Input() template: string;
  openSettings = false;
  projectName: string;
  previousText = '';
  editorConfig = {};
  directors = []
  constructor(private _bmxService: BmxService) { }

  ngOnInit(): void {
    this.editorConfig = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean']                                         // remove formatting button
      ]
    };

    this.replaceBiI_Markers()
  }

  replaceBiI_Markers(): void {
    this._bmxService.getDirectos().subscribe(directors => {
      this.directors = directors;
      if (directors) {
        localStorage.setItem('directors', JSON.stringify(directors))
      } else {
        this.directors = JSON.parse(localStorage.getItem('directors'))
      }
      const regex = /BI_DIRECTOR\d*/;
      const emailRegex = /<div style="font-size: 18px; font-family: sofia-pro; line-height: 1.5">([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})<\/div>/g;
      const componentText = this.bmxItem.componentText;
      if (componentText) {
        const match = componentText.match(regex);

        if (match) {
          const index = componentText.indexOf(match[0]);

          if (index !== -1) {
            let verify = this.bmxItem.componentText

            let updatedText = componentText;

            updatedText = updatedText.replace(/<p style="text-align:center"><br \/>BI_DIRECTOR.*?<\/p>/g, '');

            const existingEmails = updatedText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g) || [];
            const newParagraphs = this.directors.map(person => {
              const existingEmailsLower = existingEmails.map(email => email.toLowerCase());

              const emailExists = existingEmailsLower.some(existingEmail => existingEmail.toLowerCase().trim() === person.email.toLowerCase().trim());
              if (emailExists == false) {
                console.log(emailExists)
                return `
                          <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                              <p></p>
                              <p style="text-align:center; font-size: 23px; font-family: sofia-pro; line-height: 1.5">${person.name}</p>
                              <a id="person-title" style="text-align:center; font-size: 18px; font-family: sofia-pro; line-height: 1.5">${person.title}</a>
                              <p style="text-align:center; font-size: 23px; font-family: sofia-pro; line-height: 1.5">${person.email.trim()}</p>
                              <p style="text-align:center; font-size: 23px; font-family: sofia-pro; line-height: 1.5">${person.phone.trim()}</p>
                          </div>`;
              }
            }).join('');

            updatedText = componentText.substring(0, index) + newParagraphs;
            updatedText = updatedText.replace(/_1/g, '');
            this.directors.forEach(person => {
              updatedText = updatedText.replace(emailRegex, (match, p1) => {
                if (p1 === person.email) {
                  return '';
                }
                return match;
              });
            });

            this.bmxItem.componentText = updatedText;
          }
        }

        const name = localStorage.getItem('projectName');
        const company = localStorage.getItem('company');
        const replacedText = this.bmxItem.componentText
          .replace(/BI_PROJECTNAME/g, name)
          .replace(/COMPANY_NAME’s/g, company)
          .replace(/\[PROJECT NAME\]/g, name)
          .replace(/\[Project Name\]/g, name)

          .replace(/\[Company Name\]/g, company);
        this.bmxItem.componentText = replacedText;
      }
      this.previousText = this.bmxItem.componentText;
    });
  }

  editTextWithEditor(): void {
    this.bmxItem.componentText = this.previousText;
  }
  moveItemUp(): void {
    if (this.i > 0) {
        const temp = this.bmxPages[this.currentPage].page[this.i];
        this.bmxPages[this.currentPage].page[this.i] = this.bmxPages[this.currentPage].page[this.i - 1];
        this.bmxPages[this.currentPage].page[this.i - 1] = temp;
    }
}

moveItemDown(): void {
    if (this.i < this.bmxPages[this.currentPage].page.length - 1) {
        const temp = this.bmxPages[this.currentPage].page[this.i];
        this.bmxPages[this.currentPage].page[this.i] = this.bmxPages[this.currentPage].page[this.i + 1];
        this.bmxPages[this.currentPage].page[this.i + 1] = temp;
    }
}applyTitleStyle() {
  const titleElement = document.getElementById('person-title');
  if (titleElement) {
    titleElement.style.fontSize = '18px';
    titleElement.style.fontFamily = 'sofia-pro';
    titleElement.style.textAlign = 'center';
    titleElement.style.lineHeight = '1.5';
  }
}

}

