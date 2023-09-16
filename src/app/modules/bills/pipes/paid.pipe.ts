import { Pipe, PipeTransform } from '@angular/core';
import {IBill} from "../../../models/bill.model";

@Pipe({
  name: 'paid'
})
export class PaidPipe implements PipeTransform {

  transform(value: IBill, paid: boolean): boolean {
    if(paid) return value.amount != null;
    else return value.amount == null;
  }

}
