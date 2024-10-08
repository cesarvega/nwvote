import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs/internal/Subscription';
import { BmxService } from '../../../bmx.service';
import { RatingScaleComponent } from '../rating-scale/rating-scale.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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
  @Output() autoSave = new EventEmitter();
  @Output() launchTutorial = new EventEmitter();

  firstTime = true

  imageurls = [];

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
  numRatingScale: number = 5;
  ratedCounter = 0
  actualRate = 0
  showEdit = false
  selectedIndex
  //------modal-----------//
  @Output() launchPathModal = new EventEmitter();

  CREATION_VIDEO_PATH = "assets/videos/imageRate.mp4"
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
  openElements: any[] = [];
  //selectedCard: any
  dataSource: any[] = []


  constructor(private _BmxService: BmxService, dragulaService: DragulaService, _snackBar: MatSnackBar, _bmxService: BmxService, public deviceService: DeviceDetectorService) { super(dragulaService, _snackBar, _bmxService, deviceService); this.epicFunction(); }

  ngOnInit(): void {

    this.showDialog = false
    this.bmxItem.componentText.forEach(data => {
      if (data.RATE > 0) {
        this.ratedCounter++
        this.maxRuleCounter++
      }
    })

    if (this.bmxItem.componentText[0].hasOwnProperty("STARS")) {
      this.numRatingScale = this.bmxItem.componentText[0].STARS.length
    }

    this.rankingScaleValue = this.numRatingScale;

    let values = Object.keys(this.bmxItem.componentText[0])
    values.forEach(value => {
      if (typeof value == "string" && value != "STARS" && value != "CRITERIA") {
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
    if (window.innerWidth <= 1024) {
      this.VIDEO_PATH = this.PATH1;
    } else {
      this.VIDEO_PATH = this.PATH2;
    }

    this.launchPathModal.emit(this.VIDEO_PATH)
    const filteredCriteria = this.CRITERIA.filter(criteriaItem => this.selectedCriteria.map(item => item.name).includes(criteriaItem.name));
    this.newselectedCriteria = filteredCriteria
    
    this.dataSource = this.bmxItem.componentText
  }

  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    this.isDesktopDevice = this.deviceService.isDesktop();
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

  openSelected(y: any) {

    if (this.openElements.indexOf(y) === -1) {
      this.openElements.push(y);
    } else {
      this.openElements.splice(this.openElements.indexOf(y), 1);
    }
  }

  open(y: any) {

    if (this.openElements.indexOf(y) == -1) {
      return false;
    } else {
      return true;
    }

  }

  //---------end open cards--------------//

  cancelUpload() {
    this.uploadSub.unsubscribe();
    this.reset();
  }

  uploadAllImages() {

    if (this.firstTime) {
      this.firstTime = false
    }

    if (this.IMAGES_UPLOADED.length < this.bmxItem.componentText.length) {
      this.bmxItem.componentText.splice(this.IMAGES_UPLOADED.length + 1, this.bmxItem.componentText.length + 1)
    }
    this.IMAGES_UPLOADED.forEach((imageObject, index) => {
      imageObject['FileContent'] = imageObject['FileContent'].split(imageObject['FileContent'].split(",")[0] + ',').pop()
      this._BmxService.saveFileResources(JSON.stringify(imageObject)).subscribe((result: any) => {
        this.IMAGES_UPLOADED.shift()
        if (index == 0) {
          this.bmxItem.componentText[index].nameCandidates = "LOGO"
        }
        if (this.bmxItem.componentText[index + 1]) {
          this.bmxItem.componentText[index + 1].nameCandidates = JSON.parse(result.d).FileUrl
        } else {
          this.bmxItem.componentText.push({ ...this.bmxItem.componentText[1], nameCandidates: JSON.parse(result.d).FileUrl })
          const lastItem = this.bmxItem.componentText[this.bmxItem.componentText.length - 1];
          for (const key in lastItem) {
            if (lastItem.hasOwnProperty(key)) {
              if(key != 'RATE'&& key != 'nameCandidates' && key!= 'STARS'){
                lastItem[key]=''
              }
            }
          }
        }

      });
    });
    setTimeout(() => {
      this.uploadImagesBox = false;
    }, 1000);
    this.showEdit = true
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

  substractRatedCounter() {
    this.ratedCounter--
  }

  saveRate(testNameId: any) {
    this.actualRate = this.bmxItem.componentText[testNameId].RATE
  }

  checkAutosave(testNameId: any) {
    if (this.ratedCounter < this.bmxItem.componentSettings[0].maxRule && this.actualRate == 0 || this.bmxItem.componentSettings[0].maxRule == 0) {
      this.ratedCounter = this.ratedCounter + 1
      this.autoSave.emit()
    } else if (this.ratedCounter <= this.bmxItem.componentSettings[0].maxRule && this.actualRate != 0) {
      this.autoSave.next(0)
    }
  }
  checkDragEvetn(event: CdkDragDrop<string[]>) {
    if (event.previousIndex > 0 && event.currentIndex > 0) {
      moveItemInArray(this.bmxItem.componentText, event.previousIndex, event.currentIndex);

      this.autoSave.emit()
    }
  }

  openWindow(index: any, bool: any) {
    if (this.showEdit) {
      this.selectedIndex = index
      this.editSingleTableCells = bool
      this.verifyCritera()
    } else {
      this._snackBar.open('First upload the logos to use'
        , 'OK', {
        duration: 6000,
        verticalPosition: 'top',
      }).afterDismissed().subscribe(action => {

      })
    }
  }

}
