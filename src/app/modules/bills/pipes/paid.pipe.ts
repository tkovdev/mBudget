import { Pipe, PipeTransform } from '@angular/core';
import {IBill} from "../../../models/bill.model";

@Pipe({
  name: 'paid'
})
export class PaidPipe implements PipeTransform {

  transform(value: IBill | IBill[], paid: boolean): boolean {
    if(Array.isArray(value)){
      if(paid) return value.some(x => x.amount != null);
      else return value.some(x => x.amount == null);
    }else{
      if(paid) return value.amount != null;
      else return value.amount == null;
    }
  }

}
