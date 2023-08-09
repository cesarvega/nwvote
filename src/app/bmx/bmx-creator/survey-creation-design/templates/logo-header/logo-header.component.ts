import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BmxService } from '../../../bmx.service';
@Component({
  selector: 'app-logo-header',
  templateUrl: './logo-header.component.html',
  styleUrls: ['./logo-header.component.scss'],
})
export class LogoHeaderComponent implements OnInit {
  @Input() bmxItem;
  @Input() i;
  @Input() bmxClientPageDesignMode;
  @Input() bmxClientPageOverview;
  @Input() isBrandMatrixSurvey;
  displayInstructions: boolean;
  openSettings = false;
  displayLogoWidthRange = false;

  @Output() logoChanged = new EventEmitter();
  @Output() resizeWidthLogo = new EventEmitter();

  // TEMPLATE SELECTOR VARABLES
  isTemplateSelected = '';
  isSelectedButton = '';
  fileName = '';
  uploadProgress: number;
  resourceData: any;
  IMAGES_UPLOADED = [];
  projectId: any;
  biUsername: any;
  imageLogoSrc 
  showLogoIcon = false

  constructor(private _BmxService: BmxService) {}

  ngOnInit(): void {
    this.bmxItem.componentText = (localStorage.getItem('projectName'))?localStorage.getItem('projectName'):this.bmxItem.componentText;
    this.imageLogoSrc = this.bmxItem.componentSettings[0].companyLogoURL
  }

  onFileSelected(event) {
    if (event.target.files && event.target.files[0]) {
      let filesAmount = event.target.files.length;
      let fileName = event.target.files[0].name;
      let fileType = event.target.files[0].type;
      for (let i = 0; i < filesAmount; i++) {
        let reader = new FileReader();
        reader.onload = (event: any) => {
          this.IMAGES_UPLOADED.push({
            name: fileName,
            rationale: 'Sist, Assist, Syst',
            url: event.target.result,
          });
          this.resourceData = {
            ProjectName: localStorage.getItem('projectName'),
            FileName: fileName,
            ItemType: 'company-logo',
            FileType: fileType,
            FileContent: event.target.result
              .split(event.target.result.split(',')[0] + ',')
              .pop(),
          };
          console.log(this.resourceData)
          this._BmxService
            .saveFileResources(JSON.stringify(this.resourceData))
            .subscribe((result: any) => {
              this.bmxItem.componentSettings[0].companyLogoURL = JSON.parse(
                result.d
              ).FileUrl;
              this.imageLogoSrc = this.bmxItem.componentSettings[0].companyLogoURL
              this.logoChanged.emit(this.imageLogoSrc)
            });
        };
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  resizeLogo(event: any){
    this.resizeWidthLogo.emit(event)
    this._BmxService.setLogoTemporaryWidth(event)
  }

  cancelUpload() {
    // this.uploadSub.unsubscribe();
    this.reset();
  }

  uploadAllImages() {
    this._BmxService
      .saveFileResources(JSON.stringify(this.resourceData))
      .subscribe((result) => {
        var so = result;
      });
  }

  deleteIcon(){
    this.bmxItem.componentSettings[0].companyLogoURL = (this.bmxItem.componentSettings[0].companyLogoURL == '')?this.imageLogoSrc:'';
  }

  addLogo

  reset() {
    this.uploadProgress = null;
    // this.uploadSub = null;
  }
}