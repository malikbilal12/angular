
import { Injectable } from '@angular/core';
import * as recordVideo from 'recordrtc';

@Injectable({
    providedIn: 'root'
})
export class VideoRecordingService {
    private recorder: any;

    startRecording(stream: MediaStream): void {
        this.recorder = new recordVideo(stream, { type: 'video' });
        this.recorder.startRecording();
    }

    stopRecording(): Promise<Blob> {
        return new Promise((resolve, reject) => {
            this.recorder.stopRecording(() => {
                const blob = this.recorder.getBlob();
                this.recorder = null;
                resolve(blob);
            });
        });
    }
}
