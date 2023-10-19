import {inject, Injectable} from '@angular/core';
import {filter, map, Observable} from "rxjs";
import {IBalance, IBill, IIncome, IPayee, IPayer} from "../models/bill.model";
import {DriveConfig, FilesService} from "./files.service";
import {IBillSchema, IDriveSchema, ISchemaItem, SchemaType} from "../models/driveSchema.model";
import {SharedService} from "./shared.service";
import {ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot} from "@angular/router";
import {AuthService} from "../authentication/services/auth.service";
import {ConfirmationService, ConfirmEventType} from "primeng/api";
import {Month} from "../models/shared.model";

@Injectable({
  providedIn: 'root'
})
export class BillsService {
  billFileId: string = sessionStorage.getItem(DriveConfig.BILL_FILE_NAME) || '';
  constructor(private authService: AuthService, private filesService: FilesService, private sharedService: SharedService, private confirmationService: ConfirmationService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      this.authService.isLoggedIn.subscribe((loggedIn) => {
        if(!loggedIn) subscriber.next(false);
        else {
          this.filesService.listAppDataFiles().then((files) => {
            let hasFiles = false;
            if(files && files.files.length >= 1) {
              files.files.forEach((v) => {
                if(v.name == DriveConfig.BILL_FILE_NAME) {
                  hasFiles = true;
                  sessionStorage.setItem(DriveConfig.BILL_FILE_NAME, v.id);
                  this.billFileId = v.id;
                }
              });
            }
            if(!hasFiles) {
              this.confirmationService.confirm({
                message: 'To continue, we will create any necessary files in your personal Google Drive. Create files?',
                header: 'Files required',
                icon: 'pi pi-exclamation-triangle',
                key: 'noBillsConfirmation',
                accept: () => {
                  let newFile: IBillSchema = {bills: [], payees: [], income: [], balances: []};
                  this.filesService.createFile(DriveConfig.BILL_FILE_NAME, newFile).then((file) => {
                    location.reload();
                  });
                },
                reject: (type: ConfirmEventType) => {
                  switch (type) {
                    case ConfirmEventType.REJECT:
                      subscriber.next(false);
                      break;
                    case ConfirmEventType.CANCEL:
                      subscriber.next(false);
                      break;
                  }
                }
              });
            }
            else subscriber.next(true);
          });
        }
      });
    });
  }

  private getPayees(): Observable<IPayee[]>{
    return new Observable<IPayee[]>((subscriber) => {
      this.filesService.getFile<IBillSchema>(this.billFileId).then((billFile) => {
        let payees = billFile?.payees;
        if(payees) subscriber.next(payees);
        else subscriber.next([])
      })
    });
  }

  private getBills(): Observable<IBill[]> {
    return new Observable<IBill[]>((subscriber) => {
      this.filesService.getFile<IBillSchema>(this.billFileId).then((billFile) => {
        let bills = billFile?.bills;
        if(bills) subscriber.next(bills);
        else subscriber.next([])
      })
    });
  }

  private getBalances(): Observable<IBalance[]>{
    return new Observable<IBalance[]>((subscriber) => {
      this.filesService.getFile<IBillSchema>(this.billFileId).then((billFile) => {
        let balances = billFile?.balances;
        if(balances) subscriber.next(balances);
        else subscriber.next([])
      })
    });
  }

  public getYearToDateBills(year: number = this.sharedService.currentYear()): Observable<IBill[]> {
    return this.getBills().pipe(
      map((bills) => bills.filter(x => x.year == year))
    );
  }

  public getYearToDateBalances(year: number = this.sharedService.currentYear()): Observable<IBalance[]> {
    return this.getBalances().pipe(
      map((balances) => balances.filter(x => x.year == year))
    );
  }

  public getYearToDateIncome(year: number = this.sharedService.currentYear()): Observable<IIncome[]> {
    return this.getIncome().pipe(
      map((income) => income.filter(x => x.year == year))
    );
  }

  getAvailableYears(): Observable<number[]> {
    return this.getBills().pipe(
      map((bills) =>{
          let billMap = bills.map((bill: IBill) => bill.year);
          billMap.push(this.sharedService.currentYear());
          billMap = [...new Set(billMap)];
          billMap = billMap.sort((a, b) => {
            return a - b;
          });
          return billMap;
        }
      )
    );
  }

  public getMonthBills(monthYear: string = this.sharedService.currentMonthYear()): Observable<IBill[]> {
    return this.getBills().pipe(
      map((bills) => bills.filter(x => `${x.month} ${x.year}` == monthYear))
    );
  }

  public getAllPayees(): Observable<IPayee[]> {
    return this.getPayees().pipe(
      map((payees) => {
        return payees;
      }));
  }

  public getAllBillMonthYears(): Observable<string[]> {
    return this.getBills().pipe(
      map((bills) =>{
          let billMap = bills.map((bill: IBill) => `${bill.month} ${bill.year}`);
          billMap.push(`${this.sharedService.currentMonthYear()}`);
          billMap = [...new Set(billMap)];
          let months = Object.keys(Month);
          billMap = billMap.sort((a, b) => {
            let monthYearSplitA = a.split(' ');
            let monthYearSplitB = b.split(' ');
            return parseInt(`${monthYearSplitA[1]}${months.indexOf(monthYearSplitA[0])}`) - parseInt(`${monthYearSplitB[1]}${months.indexOf(monthYearSplitB[0])}`)
          });
          return billMap;
        }
      )
    );
  }

  public updateBill(bills: IBill | IBill[]): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      this.filesService.getFile<IBillSchema>(this.billFileId).then((billFile) => {
        if(billFile){
          if(Array.isArray(bills)) {
            bills.forEach(bill => {
              let toUpdateIdx = billFile.bills.findIndex(x => `${x.month} ${x.year}` == `${bill.month} ${bill.year}` && x.payee.name == bill.payee.name)
              if(toUpdateIdx > -1) {
                billFile.bills[toUpdateIdx] = bill;
              }
            })
          }else{
            let toUpdateIdx = billFile.bills.findIndex(x => `${x.month} ${x.year}` == `${bills.month} ${bills.year}` && x.payee.name == bills.payee.name)
            if(toUpdateIdx > -1) {
              billFile.bills[toUpdateIdx] = bills;
            }
          }
          this.filesService.updateFile(this.billFileId, billFile).then((res) => {
            subscriber.next(true);
          })
        }
      });
    });
  }

  public addBill(bills: IBill | IBill[]): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      this.filesService.getFile<IBillSchema>(this.billFileId).then((billFile) => {
        if(billFile){
          if(Array.isArray(bills)) {
            bills.forEach(bill => {
              if(!billFile.bills.some(x => `${x.month} ${x.year}` == `${bill.month} ${bill.year}` && x.payee.name == bill.payee.name)){
                billFile.bills.push(bill);
              }
            })
          }else{
            if(!billFile.bills.some(x => `${x.month} ${x.year}` == `${bills.month} ${bills.year}` && x.payee.name == bills.payee.name)) {
              billFile.bills.push(bills);
            }
          }
          this.filesService.updateFile(this.billFileId, billFile).then((res) => {
            subscriber.next(true);
          })
        }
      });
    });
  }

  public deleteBill(monthYear: string, payees: IPayee | IPayee[]): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      this.filesService.getFile<IBillSchema>(this.billFileId).then((billFile) => {
        if(billFile){
          if(Array.isArray(payees)){
            payees.forEach((payee, i) => {
              billFile.bills = billFile.bills.filter(x => !(`${x.month} ${x.year}` == monthYear && x.payee.name == payee.name));
            });
          }else {
            billFile.bills = billFile.bills.filter(x => !(`${x.month} ${x.year}` == monthYear && x.payee.name == payees.name))
          }
          this.filesService.updateFile(this.billFileId, billFile).then((res) => {
            subscriber.next(true);
          })
        }
      });
    });
  }

  public addPayee(payee: IPayee): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      this.filesService.getFile<IBillSchema>(this.billFileId).then((billFile) => {
        if(billFile){
          billFile.payees.push(payee);
          this.filesService.updateFile(this.billFileId, billFile).then((res) => {
            subscriber.next(true);
          })
        }
      });
    });
  }

  public deletePayee(payee: IPayee): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      this.filesService.getFile<IBillSchema>(this.billFileId).then((billFile) => {
        if(billFile){
          billFile.bills = billFile.bills.filter(x => x.payee.name != payee.name || x.amount != null);
          billFile.payees = billFile.payees.filter(x => x.name != payee.name);
          this.filesService.updateFile(this.billFileId, billFile).then((res) => {
            subscriber.next(true);
          })
        }
      });
    });
  }

  private getIncome(): Observable<IIncome[]> {
    return new Observable<IIncome[]>((subscriber) => {
      this.filesService.getFile<IBillSchema>(this.billFileId).then((billFile) => {
        let income = billFile?.income;
        if(income) subscriber.next(income);
        else subscriber.next([])
      })
    });
  }
  public getMonthIncome(monthYear: string = this.sharedService.currentMonthYear()): Observable<IIncome[]> {
    return this.getIncome().pipe(
      map((income) => income.filter(x => `${x.month} ${x.year}` == monthYear))
    );
  }

  public getIncomePayers(): Observable<string[]> {
    return this.getIncome().pipe(
      map((incomes) =>{
          let incomeMap = incomes.map((income: IIncome) => `${income.payer.name}`);
          incomeMap = [...new Set(incomeMap)];
          let months = Object.keys(Month);
          incomeMap = incomeMap.sort((a, b) => {
            return parseInt(`${a}`) - parseInt(`${b}`)
          });
          return incomeMap;
        }
      )
    );
  }
  public addIncome(income: IIncome): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      this.filesService.getFile<IBillSchema>(this.billFileId).then((billFile) => {
        if(billFile){
          if(!billFile.income.some(x => `${x.month} ${x.year}` == `${income.month} ${income.year}` && x.payer.name == income.payer.name)) {
            billFile.income.push(income);
          }else{
            let existingIncome = billFile.income.findIndex(x => `${x.month} ${x.year}` == `${income.month} ${income.year}` && x.payer.name == income.payer.name)
            if(existingIncome > -1) billFile.income[existingIncome] = income;
          }
          this.filesService.updateFile(this.billFileId, billFile).then((res) => {
            subscriber.next(true);
          })
        }
      });
    });
  }

}

export const BillGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  return inject(BillsService).canActivate(next, state);
}
