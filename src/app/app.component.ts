import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation, Renderer2, ElementRef } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isExpanded = true;
  showSubmenu = false;
  isShowing = false;
  showSubSubMenuBank = false;
  showSubSubMenuSettings = false;
  isLoginRoute = false;
  sidenavBackgroundColor = 'white';
  toolbarBackgroundColor = 'white';
  companyVersion = localStorage.getItem("companyVersion") ?? '';
  companyName: string = localStorage.getItem("organizationName") ?? '';
  license: string = localStorage.getItem("license") ?? '';
  footerText: string = 'Efcon CRM ' + 'V' + this.companyVersion + ' ' + 'Licenta client: ' + this.license;
  
  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isLoginRoute = event.url.includes('login') || event.url.includes('Login') || event.urlAfterRedirects.includes('login');
    });

    this.setSidenavBackgroundColor();
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
}