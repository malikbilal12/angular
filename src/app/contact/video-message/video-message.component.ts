
import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { VideoRecordingService } from './video-recording.service';
import { WebcamComponent } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';


@Component({
  selector: 'app-video-message',
  templateUrl: './video-message.component.html',
  styleUrls: ['./video-message.component.css']
})
export class VideoMessageComponent implements OnInit {
  @Output() recordVideo = new EventEmitter<Blob>();
  isRecording = false;
  recordedVideo: any
  mediaStream: MediaStream | null = null;
  constructor(private videoMessageService: VideoRecordingService) { }
  private trigger: Subject<void> = new Subject<void>();
  public triggerObservable: Observable<void> = this.trigger.asObservable();
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  ngOnInit(): void { }

  front = false;

  toggleCamera() {

    this.front = !this.front;
    // this.videoElement.nativeElement.srcObject = null;
    // this.offCameras()
    // this.isRecording = false
    this.stopRecording()
    this.offCameras()
  }

  ngAfterViewInit() {
    this.videoElement.nativeElement.muted = true;
  }
  // { facingMode: this.front ? "user" : "environment" }
  getConstraints() {
    return {
      audio: true,
      video: { facingMode: "environment" }
    };
  }

  startRecording(): void {
    navigator.mediaDevices.getUserMedia(this.getConstraints())
      .then(stream => {
        this.mediaStream = stream
        this.videoElement.nativeElement.srcObject = stream;
        this.videoMessageService.startRecording(stream);
        this.isRecording = true;
      })
      .catch(error => console.error('Error accessing media devices.', error));
  }

  stopRecording(): void {
    this.videoMessageService.stopRecording().then((blob: any) => {
      const recordedVideoUrl = URL.createObjectURL(blob);
      this.recordedVideo = recordedVideoUrl;
      this.recordVideo.emit(blob);
      console.log('Video recorded:', blob);
      this.isRecording = false;
    }).catch((error: any) => {
      console.error('Error stopping recording:', error);
    });

    this.offCameras();
    this.videoElement.nativeElement.srcObject = null;
  }

  clearRecording() {
    this.recordedVideo = null;
  }
  ngOnDestroy(): void {
    this.offCameras()
  }
  offCameras() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
  }
}
