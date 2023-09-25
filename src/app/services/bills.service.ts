import {Injectable} from '@angular/core';
import {filter, map, Observable} from "rxjs";
import {IBill, IPayee} from "../models/bill.model";
import {Month} from "../models/shared.model";
import {DriveConfig, FilesService} from "./files.service";
import {IBillSchema, IDriveSchema, SchemaType} from "../models/driveSchema.model";
import {SharedService} from "./shared.service";

@Injectable({
  providedIn: 'root'
})
export class BillsService {

  constructor(private filesService: FilesService, private sharedService: SharedService) { }

  private getBillsFromFile(): Observable<IBill[]>{
    return new Observable<IBill[]>((subscriber) => {
      let schema = this.filesService.retrieveSessionFile<IDriveSchema>(DriveConfig.SCHEMA_FILE_NAME);
      if(schema) {
        let billFile = schema.schemaIds.find(x => x.type == SchemaType.Bill);
        if(billFile){
          let file = this.filesService.retrieveSessionFile<IBillSchema>(billFile.id);
          if(file) subscriber.next(file.bills);
          else subscriber.next(undefined);
        }else subscriber.next(undefined)
      }else subscriber.next(undefined)
    });
  }

  private getPayeesFromFile(): Observable<IPayee[]>{
    return new Observable<IPayee[]>((subscriber) => {
      let schema = this.filesService.retrieveSessionFile<IDriveSchema>('.schema');
      if(schema) {
        let billFile = schema.schemaIds.find(x => x.type == SchemaType.Bill);
        if(billFile){
          let file = this.filesService.retrieveSessionFile<IBillSchema>(billFile.id);
          if(file) subscriber.next(file.payees);
          else subscriber.next(undefined);
        }else subscriber.next(undefined)
      }else subscriber.next(undefined)
    });
  }

  public getMonthBills(monthYear: string = this.sharedService.currentMonthYear()): Observable<IBill[]> {
    return this.getBillsFromFile().pipe(
      map((bills) => {
        let currentBills = bills.filter(x => x.month == this.sharedService.currentMonth() && x.year == this.sharedService.currentYear())
        return currentBills;
    }));
  }

  public getAllPayees(): Observable<IPayee[]> {
    return this.getPayeesFromFile().pipe(
      map((payees) => {
        return payees;
      }));
  }

  private tempPayees: IPayee[] = [
    {
      name: 'Gas'
    },
    {
      name: 'Electric'
    },
    {
      name: 'Water'
    }
  ]
  private tempBills: IBill[] = [
    {
      payee: this.tempPayees[0],
      amount: null,
      year: 2023,
      month: Month.September
    },
    {
      payee: this.tempPayees[1],
      amount: 100,
      year: 2023,
      month: Month.September
    },
    {
      payee: this.tempPayees[2],
      amount: null,
      year: 2023,
      month: Month.September
    }
  ]
}
