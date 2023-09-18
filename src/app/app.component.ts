import {Component, OnInit} from '@angular/core';
import {AuthService} from "./authentication/services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'mBudget-app';

  constructor(private authService: AuthService) {
  }
  ngOnInit(): void {
    this.authService.tokens.subscribe();
  }
}
