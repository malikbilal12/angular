import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { WebcamComponent } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';

@Component({
  selector: 'app-video-message',
  templateUrl: './video-message.component.html',
  styleUrls: ['./video-message.component.css']
})
export class VideoMessageComponent implements OnInit {
  @ViewChild('videoElement') videoElement!: WebcamComponent;
  @Output() recordVideo = new EventEmitter<string>();
  isRecording = false;
  recordedVideo: any;
  triggerObservable = new Subject<void>();
  mediaRecorder: MediaRecorder | null = null;
  recordedChunks: BlobPart[] = [];

  constructor() { }

  ngOnInit(): void { }

  startRecording(): void {
    this.isRecording = true;
    this.startMediaRecorder();
  }

  stopRecording(): void {
    console.log('stop');

    this.isRecording = false;
    this.stopMediaRecorder();
  }

  handleImage(webcamImage: WebcamImage): void {
    const recordedVideoUrl = webcamImage.imageAsDataUrl;
    this.recordedVideo = recordedVideoUrl;
    this.recordVideo.emit(recordedVideoUrl);
  }

  clearRecording() {
    this.recordedVideo = null;
  }


  private startMediaRecorder(): void {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          this.mediaRecorder = new MediaRecorder(stream);
          this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              this.recordedChunks.push(event.data);
            }
          };

          // Set up the onstop event listener before starting the recording
          this.mediaRecorder.onstop = () => {

            const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
            const recordedVideoUrl = URL.createObjectURL(blob);
            this.recordedVideo = recordedVideoUrl;
            this.recordVideo.emit(recordedVideoUrl);

            this.recordedChunks = [];
          };

          this.mediaRecorder.start();
        })
        .catch(error => console.error('Error starting media recorder.', error));
    }
  }

  private stopMediaRecorder(): void {

    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        const recordedVideoUrl = URL.createObjectURL(blob);
        this.recordedVideo = recordedVideoUrl;
        console.log(recordedVideoUrl);

        this.recordVideo.emit(recordedVideoUrl);
        this.recordedChunks = [];
      };
    }
  }
}
