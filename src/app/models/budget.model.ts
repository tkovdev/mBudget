export interface IBudget {
  name: string;
  breakdown: IBudgetBreakdown;
  income: number;
  debt: number;
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
