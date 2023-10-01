import { Injectable } from '@angular/core';
import {Month} from "../models/shared.model";

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

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
}
