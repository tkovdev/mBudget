import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot} from "@angular/router";
import {DriveConfig, FilesService} from "./files.service";
import {AuthService} from "../authentication/services/auth.service";
import {SharedService} from "./shared.service";
import {IBillSchema, IBudgetSchema} from "../models/driveSchema.model";
import {map, Observable} from "rxjs";
import {IBudget, IBudgetBreakdown, IBudgetItem} from "../models/budget.model";
import {IPayee} from "../models/bill.model";
export const BudgetGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> => {
  return inject(BudgetsService).canActivate(next, state);
}

export const BudgetFileGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> => {
  var fileService = inject(FilesService);
  var budgetService = inject(BudgetsService);
  return fileService.canActivate(next, state).then((fileGuard) => {
    if(fileGuard){
      return budgetService.canActivate(next, state);
    }else {
      return new Promise((resolver) => {
        return resolver(false)
      })
    }
  });
}

@Injectable({
  providedIn: 'root'
})
export class BudgetsService {
  budgetFileId: string = sessionStorage.getItem(DriveConfig.BUDGET_FILE_NAME) || '';

  constructor(private authService: AuthService, private filesService: FilesService, private sharedService: SharedService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolver) => {
      let budgetFileId = sessionStorage.getItem(DriveConfig.BUDGET_FILE_NAME);
      if(!budgetFileId) return resolver(false);
      this.budgetFileId = budgetFileId;

      let budgetFile = sessionStorage.getItem(this.budgetFileId);
      if (budgetFile) {
        return resolver(true);
      }
      this.filesService.getFile<IBudgetSchema>(this.budgetFileId).subscribe((res) => {
        if (res) {
          sessionStorage.setItem(this.budgetFileId, JSON.stringify(res));
          return resolver(true);
        } else {
          return resolver(false);
        }
      })
    });
  }

  private getBudgets(): Observable<IBudget[]> {
    return new Observable<IBudget[]>((subscriber) => {
      this.filesService.retrieveFile<IBudgetSchema>(this.budgetFileId).subscribe((budgetFile) => {
        let budgets = budgetFile?.budgets
        if (budgets) subscriber.next(budgets);
        else subscriber.next([])
      })
    });
  }

  public getBudgetNames(): Observable<string[]> {
    return this.getBudgets().pipe(map((budgets) => {
      return budgets.map((budget) => budget.name);
    }));
  }

  public getBudgetBreakdown(budgetName: string): Observable<IBudgetBreakdown | undefined> {
    return this.getBudgets().pipe(map((budgets) => {
      return budgets.find(x => x.name == budgetName)?.breakdown
    }));
  }

  public getBudget(budgetName: string): Observable<IBudget | undefined> {
    return this.getBudgets().pipe(map((budgets) => {
      let budget = budgets.find(x => x.name == budgetName);
      if(budget){
        budget.breakdown.need.monthlyTotal = budget.need.map((x) => x.amount).reduce((total, currentValue) => total + currentValue, 0);
        budget.breakdown.want.monthlyTotal = budget.want.map((x) => x.amount).reduce((total, currentValue) => total + currentValue, 0);
        budget.breakdown.extra.monthlyTotal = budget.extra.map((x) => x.amount).reduce((total, currentValue) => total + currentValue, 0);

        budget.breakdown.need.salaryTotal = budget.breakdown.need.monthlyTotal * 12;
        budget.breakdown.want.salaryTotal = budget.breakdown.want.monthlyTotal * 12;
        budget.breakdown.extra.salaryTotal = budget.breakdown.extra.monthlyTotal * 12;

        budget.breakdown.need.actual = budget.breakdown.need.monthlyTotal / budget.income * 100;
        budget.breakdown.want.actual = budget.breakdown.want.monthlyTotal / budget.income * 100;
        budget.breakdown.extra.actual = budget.breakdown.extra.monthlyTotal / budget.income * 100;
      }
      return budget;
    }));
  }

  public addBudget(name: string): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      this.filesService.retrieveFile<IBudgetSchema>(this.budgetFileId).subscribe((budgetFile) => {
        if (budgetFile) {
          let newBudget: IBudget = {
            name: name,
            income: 0,
            debt: 0,
            need: [],
            want: [],
            extra: [],
            breakdown: {
              need: {
                planned: 50
              },
              want: {
                planned: 30
              },
              extra: {
                planned: 20
              }
            }
          };
          budgetFile.budgets.push(newBudget);
          this.filesService.updateFile(this.budgetFileId, budgetFile).subscribe((res) => {
            subscriber.next(true);
          })
        }
      });
    });
  }

  public deleteBudget(name: string): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      this.filesService.retrieveFile<IBudgetSchema>(this.budgetFileId).subscribe((budgetFile) => {
        if (budgetFile) {
          budgetFile.budgets = budgetFile.budgets.filter(x => x.name != name);
          this.filesService.updateFile(this.budgetFileId, budgetFile).subscribe((res) => {
            subscriber.next(true);
          })
        }
      });
    });
  }

  public saveDebtToIncome(budget: IBudget): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      this.filesService.retrieveFile<IBudgetSchema>(this.budgetFileId).subscribe((budgetFile) => {
        if (budgetFile) {
          let budgetIdx = budgetFile.budgets.findIndex(x => x.name == budget.name);
          if(budgetIdx <= -1) {
            subscriber.next(false);
            return;
          }
          budgetFile.budgets[budgetIdx].income = budget.income;
          budgetFile.budgets[budgetIdx].debt = budget.debt;

          this.filesService.updateFile(this.budgetFileId, budgetFile).subscribe((res) => {
            subscriber.next(true);
          })
        }
      });
    });
  }

  public saveBreakdown(budget: IBudget): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      this.filesService.retrieveFile<IBudgetSchema>(this.budgetFileId).subscribe((budgetFile) => {
        if (budgetFile) {
          let budgetIdx = budgetFile.budgets.findIndex(x => x.name == budget.name);
          if(budgetIdx <= -1) {
            subscriber.next(false);
            return;
          }
          budgetFile.budgets[budgetIdx].breakdown = budget.breakdown;
          this.filesService.updateFile(this.budgetFileId, budgetFile).subscribe((res) => {
            subscriber.next(true);
          })
        }
      });
    });
  }

  public addBudgetItem(budgetName: string, category: 'need' | 'want' | 'extra', budgetItem: IBudgetItem): Observable<boolean>{
    return new Observable<boolean>((subscriber) => {
      this.filesService.retrieveFile<IBudgetSchema>(this.budgetFileId).subscribe((budgetFile) => {
        if (budgetFile) {
          let budgetIdx = budgetFile.budgets.findIndex(x => x.name == budgetName);
          if(budgetIdx <= -1) {
            subscriber.next(false);
            return;
          }
          budgetFile.budgets[budgetIdx][category].push(budgetItem);

          this.filesService.updateFile(this.budgetFileId, budgetFile).subscribe((res) => {
            subscriber.next(true);
          })
        }
      });
    });
  }

  public removeBudgetItem(budgetName: string, category: 'need' | 'want' | 'extra', name: string): Observable<boolean>{
    return new Observable<boolean>((subscriber) => {
      this.filesService.retrieveFile<IBudgetSchema>(this.budgetFileId).subscribe((budgetFile) => {
        if (budgetFile) {
          let budgetIdx = budgetFile.budgets.findIndex(x => x.name == budgetName);
          if(budgetIdx <= -1) {
            subscriber.next(false);
            return;
          }
          budgetFile.budgets[budgetIdx][category] = budgetFile.budgets[budgetIdx][category].filter(x => x.name != name);

          this.filesService.updateFile(this.budgetFileId, budgetFile).subscribe((res) => {
            subscriber.next(true);
          })
        }
      });
    });
  }
}
