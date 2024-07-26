import { DOCUMENT } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation, Renderer2, Inject } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './Services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from './Components/dialogs/delete-dialog-component/delete-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isExpanded = true;
  showSubmenu = true;
  isShowing = false;
  showSubSubMenuBank = false;
  showSubSubMenuSettings = false;
  isLoginRoute = false;
  sidenavBackgroundColor = 'white';
  toolbarBackgroundColor = 'white';
  companyVersion = localStorage.getItem("companyVersion") ?? '';
  companyName: string = localStorage.getItem("organizationName") ?? '';
  license: string = localStorage.getItem("license") ?? '';
  footerText: string = 'Copyright EFCON CRM ' + 'V' + this.companyVersion + ' ' + 'Licenta client: ' + this.license;

  constructor(private dialog: MatDialog, private router: Router, private renderer: Renderer2, @Inject(DOCUMENT) private document: Document, private authService: AuthService) {}

  ngOnInit() {
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isLoginRoute = event.url.includes('login') || event.url.includes('Login') || event.urlAfterRedirects.includes('login');
    });

    this.setSidenavBackgroundColor();
    this.setUsedFont();
  }

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }

  setSidenavBackgroundColor() {
    const backgroundColor = localStorage.getItem('sidenavBackgroundColor');
    const toolbarColor = localStorage.getItem('toolbarBackgroundColor');
    if (backgroundColor) {
      this.sidenavBackgroundColor = backgroundColor;
    }
    if (toolbarColor) {
      this.toolbarBackgroundColor = toolbarColor;
    }
  }

  setUsedFont(){
    const fontData = localStorage.getItem('selectedFont');
    if (fontData) {
      this.renderer.setStyle(this.document.body, 'font-family', fontData);
    }
  }

  logOut(){
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { title: 'Confirma deconectarea', message: 'Sunteti sigur ca vreti sa va deconectati ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }

    });

  }
}