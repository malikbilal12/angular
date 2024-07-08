import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContactComponent } from './contact/contact.component';
import { HttpClientModule } from '@angular/common/http';
import { VoiceMessageComponent } from './contact/voice-message/voice-message.component';
import { TakePhotoComponent } from './contact/take-photo/take-photo.component';
import { WebcamModule } from 'ngx-webcam';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerifyComponent } from './contact/verify/verify.component';
import { VideoMessageComponent } from './contact/video-message/video-message.component';
import { VideoRecordingService } from './contact/video-message/video-recording.service';
import { InvalidComponent } from './contact/invalid/invalid.component';
import { ToastsContainer } from './toast/toasts-container.component';

@NgModule({
  declarations: [
    AppComponent,
    ContactComponent,
    VoiceMessageComponent,
    TakePhotoComponent,
    VerifyComponent,
    VideoMessageComponent,
    InvalidComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    WebcamModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    ToastsContainer

  ],
  providers: [VideoRecordingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
