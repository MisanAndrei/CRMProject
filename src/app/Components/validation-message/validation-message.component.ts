import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-validation-message',
  templateUrl: './validation-message.component.html',
  styleUrl: './validation-message.component.css'
})
export class ValidationMessageComponent {
  @Input() control!: AbstractControl;
}
