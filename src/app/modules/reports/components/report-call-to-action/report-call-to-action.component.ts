import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-report-call-to-action',
  templateUrl: './report-call-to-action.component.html',
  styleUrls: ['./report-call-to-action.component.scss'],
  standalone: false
})
export class ReportCallToActionComponent {
  @Output() reportSelected = new EventEmitter<string>();

  selectReport(reportType: string): void {
    this.reportSelected.emit(reportType);
  }
}