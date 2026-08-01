import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ReportsService } from './reports.service';
import { BillsService } from './bills.service';

describe('ReportsService', () => {
  let service: ReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: BillsService,
          useValue: {
            getYearToDateBills: () => of([])
          }
        }
      ]
    });
    service = TestBed.inject(ReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});