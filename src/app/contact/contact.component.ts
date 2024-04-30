import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';


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
  public mess: string = ''
  public verifyData!: any
  public capturedImage: string = '';
  public voiceRecording: Blob | null = null

  constructor(private http: HttpClient,
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
  handleFormDataChange(formData: FormData) {
    this.verifyData = formData;
  }

  onSubmitMessage() {
    if (this.verifyData && this.selectedValue) {
      this.verifyData.message = this.selectedValue;
      console.log('Form Values:', this.verifyData);
    }
    this.modalService.dismissAll();
  }

  public onImageCaptured(image: string): void {
    this.capturedImage = image;
  }
  onSubmitPhoto() {
    if (this.verifyData && this.capturedImage) {
      this.verifyData.image = this.capturedImage
      console.log('Image Values:', this.verifyData)
    }
    this.modalService.dismissAll();
  }
  public onAudioRecorded(blob: Blob): void {
    this.voiceRecording = blob
    // console.log('Recorded audio blob:', blob);
  }
  onSubmitVoice() {
    if (this.verifyData && this.voiceRecording) {
      this.verifyData.voiceRecording = this.voiceRecording;
      console.log('Form Values:', this.verifyData);
    }
    this.voiceRecording = null
    this.modalService.dismissAll();
  }
  recordedVideoUrl: Blob | null = null;


  handleRecordedVideo(blob: Blob): void {
    this.recordedVideoUrl = blob
    console.log(this.recordedVideoUrl);

  }
  onSubmitVideo() {
    if (this.verifyData && this.recordedVideoUrl) {
      this.verifyData.recordedVideoUrl = this.recordedVideoUrl;
      console.log('Form Values:', this.verifyData);
    }
    this.recordedVideoUrl = null;
    this.modalService.dismissAll();
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


  fetchData() {
    this.loading = true;
    this.http.get(`https://justvoteit.de/demo/sheild_api/api/isValidQRCode?uuid=${this.id}`).subscribe((res: any) => {
      const responseData = res.data;
      this.mess = res.message as string
      this.status = res.is_activated;
      this.loading = false
      if (responseData && responseData.length > 0) {
        this.category = responseData;
        this.subCategories = JSON.parse(responseData[0].subcategories);
      }
    }, (error) => {
      console.error('Error fetching data:', error);
    });

  }

}
