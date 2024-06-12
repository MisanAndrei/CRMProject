import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-font-picker',
  templateUrl: './font-picker.component.html',
  styleUrl: './font-picker.component.css'
})
export class FontPickerComponent {
  fonts = ['Quicksand', 'Arial', 'Times New Roman', 'Courier'];
  selectedFont = '';

  @Output() fontSelected = new EventEmitter<string>();

  constructor() {
    const font_ls = localStorage.getItem('selectedFont');
    if(font_ls) {
      this.selectedFont = JSON.parse(font_ls).name;
    }
  }

  onFontSelected(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const font = target.value;
    this.selectedFont = font;
    localStorage.setItem('selectedFont', JSON.stringify({ name: font, url: null }));
    this.fontSelected.emit(font);
  }

  applyFont(fontName: string): void {
    const body = document.body;
    body.style.fontFamily = fontName;
  }
}
