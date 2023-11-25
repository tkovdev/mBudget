export interface IBudget {
  name: string;
  breakdown: IBudgetBreakdown;
  income: number;
  debt: number;
  need: IBudgetItem[];
  want: IBudgetItem[];
  extra: IBudgetItem[];

  [key: string]: any;
}

export interface IBudgetBreakdown {
  need: IBudgetBreakdownItem;
  want: IBudgetBreakdownItem;
  extra: IBudgetBreakdownItem;
}

export interface IBudgetBreakdownItem {
  planned: number;
  actual?: number;
  salaryTotal?: number;
  monthlyTotal?: number;
}

export interface IBudgetItem {
  name: string;
  amount: number;
}
