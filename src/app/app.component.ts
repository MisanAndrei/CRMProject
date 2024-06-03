import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isLoginRoute = event.url === '/login';
    });
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
}