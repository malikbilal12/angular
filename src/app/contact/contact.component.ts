import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../api.service';
import { ToastService } from '../toast/toast-service';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  loading: boolean = false;
  status: boolean;
  id: any | null = ''
  category: any[] = []
  subCategories: any[] | undefined
  selectedValue: any
  mobileNumber: any
  public mess: string = ''
  public verifyData!: any
  public capturedImage: string = '';
  showMessage: any

  constructor(private http: HttpClient,
    public apiService: ApiService,
    public router: Router,
    private ckdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {
    this.status = false;
    config.backdrop = 'static';
    config.keyboard = false;

  }
  @ViewChild('successTpl') successTpl!: TemplateRef<any>;
  toastService = inject(ToastService);
  showSuccess(template: TemplateRef<any>) {
    this.toastService.show({ template, classname: 'bg-success text-light', delay: 5000 });
  }
  showDanger(template: TemplateRef<any>) {
    this.toastService.show({ template, classname: 'bg-danger text-light', delay: 5000 });
  }
  handleFormDataChange(formData: FormData) {

    this.verifyData = formData;
  }
  verfySerial: any
  async onSubmitMessage() {
    if (this.verifyData && this.verifyData.vehicleNumber === this.verfySerial) {
      if (this.selectedValue) {
        const formData = {
          "tag_udid": "",
          "notification_type": "",
          "notification_media": "",
          "media_type": "",
          "mobile_user_id": "",
          "sender_mobile": "",
          "notification_text": ""
        };
        formData.tag_udid = this.id;
        formData.notification_text = this.selectedValue;
        formData.sender_mobile = this.mobileNumber;
        formData.notification_type = 'text';
        formData.mobile_user_id = this.mobile_id;
        this.verifyData.message = this.selectedValue;
        this.apiService.textMessage(formData).subscribe((res: any) => {
          console.log(res);
          this.showMessage = 'successfully sumbited'
          this.showSuccess(this.successTpl);
        });
        this.modalService.dismissAll();
      }
    } else {
      this.showMessage = 'Verification Id did not match.'
      this.showDanger(this.successTpl);
    }

  }


  public onImageCaptured(image: string): void {
    this.capturedImage = image;
  }
  onSubmitPhoto() {
    if (this.verifyData && this.verifyData.vehicleNumber === this.verfySerial) {
      if (this.capturedImage) {
        const formData = {
          "tag_udid": "",
          "notification_type": "",
          "notification_media": "",
          "media_type": "",
          "mobile_user_id": "",
          "sender_mobile": "",
          "notification_text": ""
        };

        formData.tag_udid = this.id;
        formData.media_type = 'jpeg'
        formData.notification_text = '';
        formData.sender_mobile = this.mobileNumber;
        formData.notification_type = 'picture';
        formData.notification_media = this.capturedImage
        formData.mobile_user_id = this.mobile_id;
        console.log(formData);

        this.apiService.textMessage(formData).subscribe((res: any) => {
          console.log(res);
          this.showMessage = 'successfully sumbited'
          this.showSuccess(this.successTpl);
        });
        this.capturedImage = ''
        this.modalService.dismissAll();
      }
    } else {
      this.showMessage = 'Verification Id did not match.'
      this.showDanger(this.successTpl);;
    }
  }

  public voiceRecording: any
  async onAudioRecorded(blob: Blob): Promise<void> {
    this.voiceRecording = await this.convertBlobToBase64(blob);
    console.log(this.voiceRecording);
  }

  onSubmitVoice() {
    if (this.verifyData && this.verifyData.vehicleNumber === this.verfySerial) {
      console.log(this.verfySerial);
      if (this.voiceRecording) {
        const formData = {
          "tag_udid": "",
          "notification_type": "",
          "notification_media": "",
          "media_type": "",
          "mobile_user_id": "",
          "sender_mobile": "",
          "notification_text": ""
        };

        formData.tag_udid = this.id;
        formData.media_type = 'wav'
        formData.notification_text = '';
        formData.sender_mobile = this.mobileNumber;
        formData.notification_type = 'audio';
        formData.notification_media = this.voiceRecording
        formData.mobile_user_id = this.mobile_id;
        console.log(formData);

        this.apiService.textMessage(formData).subscribe((res: any) => {
          console.log(res);
          this.showMessage = 'successfully sumbited'
          this.showSuccess(this.successTpl);
        });
        this.modalService.dismissAll();
      }
    } else {
      this.showMessage = 'Verification Id did not match.'
      this.showDanger(this.successTpl);
    }
  }
  recordedVideoUrl: any
  async handleRecordedVideo(blob: Blob): Promise<void> {
    this.recordedVideoUrl = await this.convertBlobToBase64(blob);

  }
  convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  onSubmitVideo() {
    if (this.verifyData && this.verifyData.vehicleNumber === this.verfySerial) {
      if (this.recordedVideoUrl) {
        const formData = {
          "tag_udid": "",
          "notification_type": "",
          "notification_media": "",
          "media_type": "",
          "mobile_user_id": "",
          "sender_mobile": "",
          "notification_text": ""
        };

        formData.tag_udid = this.id;
        formData.media_type = 'mp4'
        formData.notification_text = '';
        formData.sender_mobile = this.mobileNumber;
        formData.notification_type = 'video';
        formData.notification_media = this.recordedVideoUrl
        formData.mobile_user_id = this.mobile_id;
        console.log(formData);

        this.apiService.textMessage(formData).subscribe((res: any) => {
          console.log(res);
          this.showMessage = 'successfully sumbited'
          this.showSuccess(this.successTpl);
        });
        this.modalService.dismissAll();
      }
    } else {
      this.showMessage = 'Verification Id did not match.'
      this.showDanger(this.successTpl);
    }
  }

  openMessage(message: any) {
    this.modalService.open(message);
  }
  openTakePhoto(photo: any) {
    this.modalService.open(photo);
  }
  openVoice(voice: any) {
    this.voiceRecording = null
    this.modalService.open(voice);
  }
  openMakeVideo(video: any) {
    this.recordedVideoUrl = null;
    this.modalService.open(video);
  }
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.fetchData()

  }
  handleRadioChange(event: any) {
    this.selectedValue = event.target.value;
    console.log('Selected value:', this.selectedValue);
  }

  mobile_id: any
  fetchData() {
    this.loading = true;
    this.apiService.getData(this.id).subscribe((res: any) => {
      const responseData = res.data;
      this.mess = res.message as string
      this.status = res.is_activated;
      this.loading = false
      if (responseData && responseData.length > 0) {
        this.mobile_id = responseData[0].mobile_user_id
        this.mobileNumber = responseData[0].mobile
        this.verfySerial = responseData[0].verification_id
        console.log(this.mobileNumber);

        this.category = responseData;
        this.subCategories = JSON.parse(responseData[0].subcategories);
      }
    }, (error) => {
      console.error('Error fetching data:', error);
    });

  }

}
