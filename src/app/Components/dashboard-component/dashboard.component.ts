import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AggregatedStatistics, CashFlowItem, IncomeByCategoryItem, ExpensesByCategoryItem, Receivables, Payables, AccountSoldItem } from '../../Utilities/Models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  aggregatedStatistics: AggregatedStatistics = {
    accountsSold: [
      { accountName: 'Account A', totalSold: 1000 },
      { accountName: 'Account B', totalSold: 1500 },
      { accountName: 'Account C', totalSold: 2000 },
    ],
    receivables: {
      totalToReceive: 5000,
      totalOpen: 3000,
      totalOverdue: 2000,
    },
    payables: {
      totalToPay: 4000,
      totalOpen: 2500,
      totalOverdue: 1500,
    },
    cashFlow: [
      { month: 'December', year: 2023, income: 11000, expenses: 7000 },
      { month: 'January', year: 2024, income: 12000, expenses: 8000 },
      { month: 'February', year: 2024, income: 13000, expenses: 9000 },
      { month: 'March', year: 2024, income: 14000, expenses: 10000 },
      { month: 'April', year: 2024, income: 15000, expenses: 11000 },
      { month: 'May', year: 2024, income: 16000, expenses: 12000 },
      { month: 'June', year: 2024, income: 17000, expenses: 13000 },
      { month: 'July', year: 2024, income: 18000, expenses: 14000 },
      { month: 'August', year: 2024, income: 19000, expenses: 15000 },
      { month: 'September', year: 2024, income: 20000, expenses: 16000 },
      { month: 'October', year: 2024, income: 21000, expenses: 17000 },
      { month: 'November', year: 2024, income: 22000, expenses: 18000 },
      { month: 'December', year: 2024, income: 23000, expenses: 19000 },
    ],
    incomeByCategory: [
      { categoryName: 'Category 1', colorCode: '#FF6384', income: 5000 },
      { categoryName: 'Category 2', colorCode: '#36A2EB', income: 7000 },
      { categoryName: 'Category 3', colorCode: '#FFCE56', income: 9000 },
    ],
    expensesByCategory: [
      { categoryName: 'Category 1', colorCode: '#FF6384', expenses: 4000 },
      { categoryName: 'Category 2', colorCode: '#36A2EB', expenses: 6000 },
      { categoryName: 'Category 3', colorCode: '#FFCE56', expenses: 8000 },
    ],
  };

  // Bar chart options and data for CashFlow
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
  };
  public barChartData: ChartData<'bar'> = {
    labels: this.aggregatedStatistics.cashFlow.map(cf => cf.month),
    datasets: [
      { data: this.aggregatedStatistics.cashFlow.map(cf => cf.income), label: 'Income' },
      { data: this.aggregatedStatistics.cashFlow.map(cf => cf.expenses), label: 'Expenses' }
    ],
  };

  // Pie chart options and data for Income by Category
  public pieChartIncomeOptions: ChartOptions<'pie'> = {
    responsive: true,
  };
  public pieChartIncomeData: ChartData<'pie'> = {
    labels: this.aggregatedStatistics.incomeByCategory.map(ic => ic.categoryName),
    datasets: [
      {
        data: this.aggregatedStatistics.incomeByCategory.map(ic => ic.income),
        backgroundColor: this.aggregatedStatistics.incomeByCategory.map(ic => ic.colorCode),
      }
    ],
  };

  // Pie chart options and data for Expenses by Category
  public pieChartExpensesOptions: ChartOptions<'pie'> = {
    responsive: true,
  };
  public pieChartExpensesData: ChartData<'pie'> = {
    labels: this.aggregatedStatistics.expensesByCategory.map(ec => ec.categoryName),
    datasets: [
      {
        data: this.aggregatedStatistics.expensesByCategory.map(ec => ec.expenses),
        backgroundColor: this.aggregatedStatistics.expensesByCategory.map(ec => ec.colorCode),
      }
    ],
  };

  dateRangeForm: FormGroup = this.fb.group({
    startDate: [''],
    endDate: ['']
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {}

  onSubmit(){

  }
}