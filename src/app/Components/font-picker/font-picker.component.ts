import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-font-picker',
  templateUrl: './font-picker.component.html',
  styleUrl: './font-picker.component.css'
})
export class FontPickerComponent {
  fonts = ['Roboto','Open Sans','Lato','Montserrat','Source Sans Pro','Nunito','PT Sans','Raleway','Ubuntu','Noto Sans','Dosis','Muli','Work Sans','Poppins','Inter'];
  selectedFont = '';

  @Output() fontSelected = new EventEmitter<string>();

  constructor() {
    const font_ls = localStorage.getItem('selectedFont');
    if(font_ls) {
      this.selectedFont = font_ls;
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
