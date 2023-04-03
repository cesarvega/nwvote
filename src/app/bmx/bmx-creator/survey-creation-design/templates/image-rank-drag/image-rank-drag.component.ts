import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs/internal/Subscription';
import { BmxService } from '../../../bmx.service';
import { RatingScaleComponent } from '../rating-scale/rating-scale.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DeviceDetectorService } from 'ngx-device-detector';
@Component({
  selector: 'app-image-rank-drag',
  templateUrl: './image-rank-drag.component.html',
  styleUrls: ['./image-rank-drag.component.scss']
})
export class ImageRankDragComponent extends RatingScaleComponent implements OnInit {

  //  INTRUCTIONS : Load the excel firs and the the images
  @Input() bmxItem;
  @Input() i;
  @Input() bmxClientPageDesignMode;
  @Input() bmxClientPageOverview;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  imageurls = [];

  @Output() launchPathModal = new EventEmitter();

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
  showMatrixMenu: boolean = false;
  iconMenuShow: string = "add_circle_outline"
  numRatingScale: number = 0;

  draggableBag
  isdropDown = true

  ratedCounter = 0
  actualRate = 0

  //------modal-----------//
 

  VIDEO_PATH: any[] = [];

  PATH1: any[] = [
    'assets/img/bmx/tutorial/image-drag.JPG',
    
  ]

  PATH2: any[] = [
    'assets/img/bmx/tutorial/image-drag2.JPG',  
  ]

  deviceInfo = null;
  public isDesktopDevice: any = null;

  //----------end modal--------//

  //--------open cards---------//
  openElements: any[]=[];
  //selectedCard: any

  constructor(private _BmxService: BmxService, dragulaService: DragulaService, _snackBar: MatSnackBar, _bmxService: BmxService,public deviceService: DeviceDetectorService) { super(dragulaService, _snackBar, _bmxService,deviceService); this.epicFunction(); }
  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    this.isDesktopDevice = this.deviceService.isDesktop();
    console.log(this.deviceInfo);
    console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
    console.log(isTablet);  // returns if the device us a tablet (iPad etc)
  }
  ngOnInit(): void {
  
    this.numRatingScale = this.bmxItem.componentText[0].STARS.length
    this.rankingScaleValue = this.numRatingScale;
    let values = Object.keys(this.bmxItem.componentText[0])
    values.forEach(value => {
      if (typeof value == "string" && value != "STARS" && value != "CRITERIA") {
        this.columnsNames.push(value)
      }
    });

    this.rowsCount = this.bmxItem.componentText.length - 1;

    this.randomizeTestNames = this.bmxItem.componentSettings[0].randomizeTestNames

    if (this.rankingType == 'dropDown') {
      // this.draggableBag = ''
      // this.isdropDown = true
      this.draggableBag = 'DRAGGABLE_RANK_ROW'
      this.isdropDown = false
    } else if (this.rankingType == 'dragAndDrop') {
      this.draggableBag = 'DRAGGABLE_RANK_ROW'
      this.isdropDown = false

    } else if (this.rankingType == 'radio') {
      this.draggableBag = ''
      this.isdropDown = false
      this.radioColumnCounter = 1
    }

    // if(this.isDesktopDevice){
    //   this.VIDEO_PATH = this.PATH2;
    // }else{
    //   this.VIDEO_PATH = this.PATH1;
    // }

    if(window.innerWidth <= 1024){
      this.VIDEO_PATH = this.PATH1;
    }else{
      this.VIDEO_PATH = this.PATH2;
    }
    this.launchPathModal.emit(this.VIDEO_PATH)    
  }

  onFileSelected(event) {
    if (event.target.files && event.target.files[0]) {
      let filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        let reader = new FileReader();
        let FileName = event.target.files[i].name
        let FileType = event.target.files[i].type
        reader.onload = (event: any) => {
          this.resourceData = {
            "ProjectName": localStorage.getItem('projectName'),
            "FileName": FileName.split(' ').join(''),
            "ItemType": 'logo-rate',
            "FileType": FileType,
            "FileContent": event.target.result
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

  uploadAllImages() {
    this.IMAGES_UPLOADED.forEach((imageObject, index) => {
      imageObject['FileContent'] = imageObject['FileContent'].split(imageObject['FileContent'].split(",")[0] + ',').pop()
      this._BmxService.saveFileResources(JSON.stringify(imageObject)).subscribe((result: any) => {
        this.IMAGES_UPLOADED.shift()
        // imageObject['FileContent'] = JSON.parse(result.d).FileUrl
        this.bmxItem.componentText[index + 1].nameCandidates = JSON.parse(result.d).FileUrl
        this.bmxItem.componentText[index + 1].name = JSON.parse(result.d).FileUrl
      });
    });

    setTimeout(() => {
      this.uploadImagesBox = false;
    }, 1000);

  }

  deleteImage(index) {
    this.IMAGES_UPLOADED.splice(index, 1)
  }


  toggleImageUploadBox() {
    this.uploadImagesBox = !this.uploadImagesBox
  }

  reset() {
    this.uploadProgress = null;
    this.uploadSub = null;
  }

  saveRate(testNameId:any){
    this.actualRate = this.bmxItem.componentText[testNameId].RATE
  }

  checkAutosave(testNameId:any) {
    console.log(this.bmxItem.componentText[testNameId].RATE)
     if (this.ratedCounter < this.bmxItem.componentSettings[0].maxRule && this.actualRate == 0|| this.bmxItem.componentSettings[0].maxRule == 0  ) {
        this.ratedCounter = this.ratedCounter + 1
        this.autoSave.emit()
    } else if(this.ratedCounter <= this.bmxItem.componentSettings[0].maxRule && this.actualRate != 0){
      this.autoSave.next()    
    } 
  }

  checkDragEvetn(event: CdkDragDrop<string[]>) {

      moveItemInArray(this.bmxItem.componentText, event.previousIndex, event.currentIndex);
      this.bmxItem.componentText.forEach((row, rowIndex) => {
        if (rowIndex > 0) {
          row.RATE = rowIndex
        }
      })
      this.autoSave.emit()
  }
  showMatrixMenuBmx(){
    this.showMatrixMenu = !this.showMatrixMenu;
      if(this.showMatrixMenu){
        this.iconMenuShow = "remove_circle_outline"
      }else{
        this.iconMenuShow = "add_circle_outline"
      }
  }
}

