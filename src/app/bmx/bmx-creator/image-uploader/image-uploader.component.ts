import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { BmxService } from '../bmx.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { DragulaService } from 'ng2-dragula';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { typeSourceSpan } from '@angular/compiler';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit {

  imageurls =[];



  IMAGES_UPLOADED = [
    { name: 'Image 1', rationale: 'Sist, Assist, Syst', url: 'string' },
  ];

  AUTOSIZE_OPTIONS = [
    { name: 'Client Logo', rationale: 'Sist, Assist, Syst' },
    { name: 'Test Logo', rationale: 'Hance, En-' },
    { name: 'Diagram', rationale: 'Evo' },
    { name: 'Other', rationale: 'Gard, Guard' }
  ];

  // TEMPLATE SELECTOR VARABLES
  isTemplateSelected = '';
  isSelectedButton = '';
  fileName = '';
  uploadProgress: number;
  uploadSub: Subscription;

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute,
    private _hotkeysService: HotkeysService, private dragulaService: DragulaService, private _BmxService: BmxService) { }


  ngOnInit(): void {
  }
  /*
  onFileSelected(event) {
    for (var i = 0; i < event.target.files.length; i++) {
      const file: File = event.target.files[i];
      if (file) {
        this.fileName = this.fileName + '\n' + file.name;
        const formData = new FormData();
        formData.append("thumbnail", file);
        var s;
        var reader = new FileReader();

        reader.onload = (_event) => {
           s = reader.result.toString();
           this.IMAGES_UPLOADED.push({ name: this.IMAGES_UPLOADED.length.toString(), rationale: 'Sist, Assist, Syst', url: s });
        }
        reader.readAsDataURL(event.target.files[i]);

      }

    }

  }
  */
  onFileSelected(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.IMAGES_UPLOADED.push({ name: this.IMAGES_UPLOADED.length.toString(), rationale: 'Sist, Assist, Syst', url: event.target.result });
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }


  cancelUpload() {
    this.uploadSub.unsubscribe();
    this.reset();
  }

  reset() {
    this.uploadProgress = null;
    this.uploadSub = null;
  }

  /*
  onFileSelected(event) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("thumbnail", file);

      const upload$ = this.http.post("/api/thumbnail-upload", formData, {
        reportProgress: true,
        observe: 'events'
      })

      this.uploadSub = upload$.subscribe(event => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
        }
      })
    }
  }
  */



}
function getRandomInt(arg0: number) {
  throw new Error('Function not implemented.');
}

