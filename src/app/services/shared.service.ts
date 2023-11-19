import {Injectable} from '@angular/core';
import {Month} from "../models/shared.model";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private _loadingQueue: string[] = [];

  isLoadingEmit: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  queueLoading(name: string): void {
    this._loadingQueue.push(name);
    this.isLoadingEmit.next(this.loadingQueue.length > 0);
  }

  dequeueLoading(name: string): void {
    let foundIdx = this._loadingQueue.findIndex(x => x == name);
    if (foundIdx > -1) this._loadingQueue.splice(foundIdx, 1);
    this.isLoadingEmit.next(this.loadingQueue.length > 0);
  }

  get loadingQueue(): string[] {
    return this._loadingQueue;
  }

  currentDate(): string {
    let currentDate: Date = new Date();
    return `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;
  }

  currentMonthYear(): string {
    let currentDate: Date = new Date();
    let month: string = currentDate.toLocaleString('default', { month: 'long' })
    return `${month} ${currentDate.getFullYear()}`
  }

  currentMonth(): Month {
    let currentDate: Date = new Date();
    let month: string = currentDate.toLocaleString('default', { month: 'long' });
    return month as Month;
  }

  currentYear(): number {
    let currentDate: Date = new Date();
    return currentDate.getFullYear();
  }

  fromMonthYearString(monthYear: string): {month: Month, year: number} {
    let monthYearSplit = monthYear.split(' ');
    let month: Month = <Month> monthYearSplit[0];
    let year: number = parseInt(monthYearSplit[1]);
    return {month: month, year: year};
  }

  cleanMonth(uncleanMonth: string): string {
    let cleanMonth = uncleanMonth.toLowerCase();
    let capLetter = cleanMonth.charAt(0).toUpperCase();
    let remainingLetter = cleanMonth.substring(1);
    cleanMonth = capLetter + remainingLetter;
    return cleanMonth;
  }

  cleanYear(uncleanYear: string): number {
    let cleanYear = -1;
    try{
      cleanYear = parseInt(uncleanYear);
    }catch {
      return -1
    }
    return cleanYear;
  }
}
