import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { BmxService } from '../bmx.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { DragulaService } from 'ng2-dragula';
import { ActivatedRoute } from '@angular/router';

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
  @Input() isMenuActive10;

  constructor(private _BmxService: BmxService) { }


  ngOnInit(): void { }

  onFileSelected(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.IMAGES_UPLOADED.push({ name: this.IMAGES_UPLOADED.length.toString(), rationale: 'Sist, Assist, Syst', url: event.target.result });
          const filedata = event.target.result.split(",")[0];
          const resourceData:JSON = <JSON><unknown>{
            "ProjectName": localStorage.getItem('projectName'),
            "FileName": this.IMAGES_UPLOADED.length.toString() + '.' + filedata.substring((filedata.indexOf("/")+1),(filedata.indexOf(";") )),
            "ItemType" : 'TestName',
            "FileType" : filedata,
            "FileContent" : event.target.result.split(event.target.result.split(",")[0] + ',').pop()
          }
          this._BmxService.saveFileResources(JSON.stringify(resourceData)).subscribe(result => {
            var so = result;
          });
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

}


