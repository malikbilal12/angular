import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { WebcamComponent } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';

@Component({
  selector: 'app-video-message',
  templateUrl: './video-message.component.html',
  styleUrls: ['./video-message.component.css']
})
export class VideoMessageComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: WebcamComponent;
  @Output() recordVideo = new EventEmitter<Blob>();
  isRecording = false;
  recordedVideo: any;
  triggerObservable = new Subject<void>();
  mediaRecorder: MediaRecorder | null = null;
  recordedChunks: BlobPart[] = [];
  mediaStream: MediaStream | null = null;

  constructor(private ckdRef: ChangeDetectorRef) { }

  ngOnInit(): void { }

  startRecording(): void {
    this.isRecording = true;
    this.startMediaRecorder();
  }


  stopRecording(): void {
    this.stopMediaRecorder();
  }

  handleImage(webcamImage: WebcamImage): void {
    const recordedVideoUrl = webcamImage.imageAsDataUrl;
    this.recordedVideo = recordedVideoUrl;
  }

  clearRecording() {
    this.recordedVideo = null;
    this.isRecording = false;
    this.ckdRef.detectChanges();
  }


  private startMediaRecorder(): void {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          this.mediaStream = stream;
          this.mediaRecorder = new MediaRecorder(stream);
          this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              this.recordedChunks.push(event.data);
            }
          };

          this.mediaRecorder.onstop = () => {
            const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
            const recordedVideoUrl = URL.createObjectURL(blob);
            this.recordedVideo = recordedVideoUrl;
            this.recordVideo.emit(blob);
            this.recordedChunks = [];
            this.isRecording = false;
            this.ckdRef.detectChanges();
          };

          this.mediaRecorder.start();
          this.isRecording = true;
          this.ckdRef.detectChanges();
        })
        .catch(error => console.error('Error starting media recorder.', error));
    }
  }


  private stopMediaRecorder(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
  }

  ngOnDestroy(): void {
    this.stopMediaRecorder();
  }
}
