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

  constructor(private router: Router) {}

  ngOnInit() {
    localStorage.setItem('sidenavBackgroundColor', "#808080");
    localStorage.setItem('toolbarBackgroundColor', '#989898');
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isLoginRoute = event.url === '/login';
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