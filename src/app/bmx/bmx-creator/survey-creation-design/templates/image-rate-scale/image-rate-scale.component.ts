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
  

  constructor(private _BmxService: BmxService) {super()}

  ngOnInit(): void {

    // COLUMN NAMES
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
