import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs/internal/Subscription';
import { BmxService } from '../../../bmx.service';
import { RatingScaleComponent } from '../rating-scale/rating-scale.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeviceDetectorService } from 'ngx-device-detector';

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

  @Output() launchTutorial = new EventEmitter(); 
  

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
  uploadImagesBox = false;

  numRatingScale: number = 0;

 
  //------modal-----------//
  @Output() launchPathModal = new EventEmitter(); 

  VIDEO_PATH: any[] = [];

  PATH1: any[] = [
    'assets/img/bmx/tutorial/image-rate-scale-mobil.jpg',
    'assets/img/bmx/tutorial/image-rate-scale-mobil2.jpg',    
  ]

  PATH2: any[] = [
    'assets/img/bmx/tutorial/image-rate-scale-desktop.JPG',
    'assets/img/bmx/tutorial/image-rate-scale-desktop2.JPG',  
  ]

  deviceInfo = null;
  public isDesktopDevice: any = null;

  //--------open cards---------//
   openElements: any[]=[];
  //selectedCard: any

  constructor(private _BmxService: BmxService,dragulaService: DragulaService, _snackBar: MatSnackBar,  _bmxService: BmxService,public deviceService: DeviceDetectorService)
   {super(dragulaService,_snackBar,_bmxService,deviceService); this.epicFunction();}

  ngOnInit(): void {  
    
    if(this.bmxItem.componentText[0].hasOwnProperty("STARS")){
      this.numRatingScale = this.bmxItem.componentText[0].STARS.length
    }

    this.rankingScaleValue = this.numRatingScale;

    if(window.innerWidth <= 1024){
      this.VIDEO_PATH = this.PATH1;
    }else{
      this.VIDEO_PATH = this.PATH2;
    }
    
    let values = Object.keys(this.bmxItem.componentText[0])
    values.forEach(value => {
      if (typeof value == "string" && value != "STARS" && value != "CRITERIA" ) {
        this.columnsNames.push(value)
      }
    });
    
    this.randomizeTestNames = this.bmxItem.componentSettings[0].randomizeTestNames
    this.rowsCount = this.bmxItem.componentText.length - 1;

    // if(this.isDesktopDevice){
    //   this.VIDEO_PATH = this.PATH2;
    // }else{
    //   this.VIDEO_PATH = this.PATH1;
    // }

    this.launchPathModal.emit(this.VIDEO_PATH)
  }

  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    this.isDesktopDevice = this.deviceService.isDesktop();
    console.log(this.deviceInfo);
    console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
    console.log(isTablet);  // returns if the device us a tablet (iPad etc)
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

  //----------open cards-----------//

  openSelected(y: any){

    if (this.openElements.indexOf(y) === -1) {
      this.openElements.push(y);
    } else {
      this.openElements.splice(this.openElements.indexOf(y),1);
    }
    console.log(this.openElements)
  } 

  open(y: any){

    if(this.openElements.indexOf(y) == -1){
      return false;
    }else{
      console.log('true')
      return true;
    }
    
  }

  //---------end open cards--------------//

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
        if( this.bmxItem.componentText[index + 1]){
          this.bmxItem.componentText[index + 1].name = this.bmxItem.componentText[index + 1].name
          this.bmxItem.componentText[index + 1].nameCandidates = JSON.parse(result.d).FileUrl
        }else{
          this.bmxItem.componentText.push({name : JSON.parse(result.d).FileUrl,nameCandidates:JSON.parse(result.d).FileUrl})
        }
        
      });
    });
    setTimeout(() => {
      this.uploadImagesBox = false;    
    }, 1000);
  }

  deleteImage(index){
    this.IMAGES_UPLOADED.splice(index, 1)
  }

  toggleImageUploadBox(){
    this.uploadImagesBox = !this.uploadImagesBox
  }

  reset() {
    this.uploadProgress = null;
    this.uploadSub = null;
  }
}
