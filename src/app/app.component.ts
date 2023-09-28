import {Component, OnInit} from '@angular/core';
import {AuthService} from "./authentication/services/auth.service";
import {FilesService} from "./services/files.service";
import {SchemaType} from "./models/driveSchema.model";
import {IBill, IPayee} from "./models/bill.model";
import {Month} from "./models/shared.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'mBudget-app';

  constructor(private authService: AuthService, private fileService: FilesService) {
  }
  ngOnInit(): void {
  }
}
