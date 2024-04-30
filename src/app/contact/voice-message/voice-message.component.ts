import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as recordRTC from 'recordrtc';

@Component({
  selector: 'app-voice-message',
  templateUrl: './voice-message.component.html',
  styleUrls: ['./voice-message.component.css']
})
export class VoiceMessageComponent implements OnDestroy {
  record: any;
  recording = false;
  url: any;
  error: any;
  timer: any;
  counter: any
  formattedTime: any
  mediaStream: MediaStream | null = null;
  @Output() audioRecorded: EventEmitter<Blob> = new EventEmitter<Blob>();
  constructor(private sanitizer: DomSanitizer) { }
  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  startRecording() {
    this.recording = true;
    this.counter = 0;
    this.formattedTime = '0:00';
    this.timer = setInterval(() => {
      this.counter++;
      const minutes = Math.floor(this.counter / 60);
      const seconds = this.counter % 60;
      this.formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      if (this.counter >= 30) {
        this.stopRecording();
      }
    }, 1000);
    const mediaConstraints = {
      video: false,
      audio: true
    };
    navigator.mediaDevices.getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  successCallback(stream: MediaStream) {
    this.mediaStream = stream
    this.record = new recordRTC.StereoAudioRecorder(stream, {
      mimeType: "audio/wav"
    });
    this.record.record();
  }

  stopRecording() {
    this.recording = false;
    clearInterval(this.timer)
    this.record.stop(this.processRecording.bind(this));
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
  }

  processRecording(blob: any) {
    this.url = URL.createObjectURL(blob);
    // console.log("blob", blob);
    // console.log("url", this.url);
    this.audioRecorded.emit(blob);
  }

  errorCallback(error: any) {
    this.error = 'Can not play audio in your browser';
  }
  clearRecording() {
    this.url = null;
  }

  ngOnDestroy() {
    clearInterval(this.timer);
    if (this.recording) {
      this.stopRecording();
    }
  }

}
