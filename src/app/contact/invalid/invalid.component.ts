import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-invalid',
  templateUrl: './invalid.component.html',
  styleUrls: ['./invalid.component.css']
})
export class InvalidComponent {
  @Input() mess: any;



}
