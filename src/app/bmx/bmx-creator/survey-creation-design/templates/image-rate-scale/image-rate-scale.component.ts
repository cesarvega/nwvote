import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs/internal/Subscription';
import { BmxService } from '../../../bmx.service';
import { RatingScaleComponent } from '../rating-scale/rating-scale.component';
@Component({
  selector: 'app-image-rate-scale',
  templateUrl: './image-rate-scale.component.html',
  styleUrls: ['./image-rate-scale.component.scss']
})
export class ImageRateScaleComponent extends RatingScaleComponent implements OnInit {

 
  @Input() bmxItem;
  @Input() i;
  @Input() bmxClientPageDesignMode;
  @Input() bmxClientPageOverview;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  IMAGES_UPLOADED = []
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
  resourceData: any;
  

  constructor(private _BmxService: BmxService) {super()}

  ngOnInit(): void {
    let values = Object.keys(this.bmxItem.componentText[0])
    values.forEach(value => {
      if (typeof value == "string" && value != "STARS" && value != "CRITERIA" ) {
        this.columnsNames.push(value)
      }
    });
  }


  onFileSelected(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.IMAGES_UPLOADED.push({ name: event.target.files[i].name, rationale: 'Sist, Assist, Syst', url: event.target.result });
          this.resourceData = {
            "ProjectName": localStorage.getItem('projectName'),
            "FileName": event.target.files[i].name,
            "ItemType" : 'logo-rate',
            "FileType" : event.target.files[i].type,
            "FileContent" : event.target.result.split(event.target.result.split(",")[0] + ',').pop()
          }
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  cancelUpload() {
    this.uploadSub.unsubscribe();
    this.reset();
  }

  uploadAllImages(){
    this._BmxService.saveFileResources(JSON.stringify(this.resourceData)).subscribe(result => {
      var so = result;
    });
  }

  reset() {
    this.uploadProgress = null;
    this.uploadSub = null;
  }
}
