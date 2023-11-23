export interface IBudgetBreakdown {
  need: IBudgetBreakdownItem;
  want: IBudgetBreakdownItem;
  extra: IBudgetBreakdownItem;
}

export interface IBudgetBreakdownItem {
  planned: number;
  actual: number;
  salaryTotal: number;
  monthlyTotal: number;
}
