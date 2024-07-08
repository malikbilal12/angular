import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent {
  form: FormGroup;
  @Output() formDataChange: EventEmitter<any> = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      vehicleNumber: ['', Validators.required],
      phone: ['', [Validators.pattern(/^\d+$/)]]
    });

    this.form.valueChanges.subscribe(data => {
      if (this.form.valid) {
        this.formDataChange.emit(data);
      }
    });
  }
}
