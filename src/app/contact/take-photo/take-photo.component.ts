import { Component, EventEmitter, Output } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-take-photo',
  templateUrl: './take-photo.component.html',
  styleUrls: ['./take-photo.component.css']
})
export class TakePhotoComponent {

  public webcamImage: WebcamImage = {} as WebcamImage;
  public capturedImage: string = '';
  @Output() imageCaptured: EventEmitter<string> = new EventEmitter<string>();
  private trigger: Subject<void> = new Subject<void>();
  public triggerObservable: Observable<void> = this.trigger.asObservable();

  public handleImageCapture(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.capturedImage = webcamImage.imageAsDataUrl;
  }


  public captureImage(): void {
    this.trigger.next();
    this.imageCaptured.emit(this.capturedImage);

  }

  public retakePhoto(): void {
    this.webcamImage = {} as WebcamImage;
    this.capturedImage = '';
  }
}
