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

//  INTRUCTIONS : Load the excel firs and the the images
  @Input() bmxItem;
  @Input() i;
  @Input() bmxClientPageDesignMode;
  @Input() bmxClientPageOverview;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  imageurls =[];



  IMAGES_UPLOADED = [
    
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
  resourceData: any;
  logoWidth = 200

  constructor(private _BmxService: BmxService,dragulaService: DragulaService) {super(dragulaService)}

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
      let filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        let reader = new FileReader();
        let FileName = event.target.files[i].name
        let FileType =  event.target.files[i].type
        reader.onload = (event: any) => {          
          this.resourceData = {
            "ProjectName": localStorage.getItem('projectName'),
            "FileName": FileName.split(' ').join(''),
            "ItemType" : 'logo-rate',
            "FileType" : FileType,
            "FileContent" : event.target.result
            // "FileContent" : event.target.result.split(event.target.result.split(",")[0] + ',').pop()
          }
          this.IMAGES_UPLOADED.push(this.resourceData);
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
    this.IMAGES_UPLOADED.forEach((imageObject , index) => {
      imageObject['FileContent'] = imageObject['FileContent'].split(imageObject['FileContent'].split(",")[0] + ',').pop()
      this._BmxService.saveFileResources(JSON.stringify(imageObject)).subscribe((result:any) => {
        this.IMAGES_UPLOADED.shift()
        // imageObject['FileContent'] = JSON.parse(result.d).FileUrl
        this.bmxItem.componentText[index + 1].nameCandidates = JSON.parse(result.d).FileUrl
        this.bmxItem.componentText[index + 1].name = JSON.parse(result.d).FileUrl
      });
    });

    setTimeout(() => {
      this.selectedIndex = ''
    }, 1000);
   
  }

  deleteImage(index){
    this.IMAGES_UPLOADED.splice(index, 1)
  }

  reset() {
    this.uploadProgress = null;
    this.uploadSub = null;
  }
}
