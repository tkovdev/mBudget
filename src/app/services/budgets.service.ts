import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot} from "@angular/router";
import {DriveConfig, FilesService} from "./files.service";
import {AuthService} from "../authentication/services/auth.service";
import {SharedService} from "./shared.service";
import {IBillSchema, IBudgetSchema} from "../models/driveSchema.model";
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
}
