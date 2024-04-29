
import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { VideoRecordingService } from './video-recording.service';


@Component({
  selector: 'app-video-message',
  templateUrl: './video-message.component.html',
  styleUrls: ['./video-message.component.css']
})
export class VideoMessageComponent implements OnInit {
  @ViewChild('videoElement') videoElement!: ElementRef;
  @Output() recordVideo = new EventEmitter<string>();
  isRecording = false;
  video: any
  constructor(private videoMessageService: VideoRecordingService) { }

  ngOnInit(): void { }

  startRecording(): void {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        this.videoElement.nativeElement.srcObject = stream;
        this.videoMessageService.startRecording(stream);
        this.isRecording = true;
      })
      .catch(error => console.error('Error accessing media devices.', error));
  }
  recordedVideo: any

  stopRecording(): void {
    this.videoMessageService.stopRecording().then((blob: any) => {
      const recordedVideoUrl = URL.createObjectURL(blob);
      this.recordedVideo = recordedVideoUrl;
      this.recordVideo.emit(blob)
      // console.log('Video recorded:', blob);
      this.isRecording = false;
      this.videoElement.nativeElement.srcObject = null;
    });
  }
  clearRecording() {
    this.recordedVideo = null;
  }
}
