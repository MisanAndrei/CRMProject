import { Component, OnInit } from '@angular/core'
import { ChartData, ChartOptions } from 'chart.js'
import { FormBuilder, FormGroup } from '@angular/forms'

import {
  AggregatedStatistics,
  CashFlowItem,
  IncomeByCategoryItem,
  ExpensesByCategoryItem,
  Receivables,
  Payables,
  AccountSoldItem,
} from '../../Utilities/Models'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  aggregatedStatistics: AggregatedStatistics = {
    accountsSold: [
      { accountName: 'Cont A', totalSold: 1000 },
      { accountName: 'Cont B', totalSold: 1500 },
      { accountName: 'Cont C', totalSold: 2000 },
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
      {
        month: 'Decembrie',
        year: 2023,
        income: 11000,
        expenses: 7000,
      },
      {
        month: 'Ianuarie',
        year: 2024,
        income: 12000,
        expenses: 8000,
      },
      {
        month: 'Februarie',
        year: 2024,
        income: 13000,
        expenses: 9000,
      },
      {
        month: 'Martie',
        year: 2024,
        income: 13000,
        expenses: 9000,
      },
      {
        month: 'Aprilie',
        year: 2024,
        income: 13000,
        expenses: 9000,
      },
      {
        month: 'Mai',
        year: 2024,
        income: 13000,
        expenses: 9000,
      },
      {
        month: 'Iunie',
        year: 2024,
        income: 13000,
        expenses: 9000,
      },
      {
        month: 'Iulie',
        year: 2024,
        income: 13000,
        expenses: 9000,
      },
      {
        month: 'August',
        year: 2024,
        income: 13000,
        expenses: 9000,
      },
      {
        month: 'Septembrie',
        year: 2024,
        income: 13000,
        expenses: 9000,
      },
      {
        month: 'Octombrie',
        year: 2024,
        income: 13000,
        expenses: 9000,
      },
      {
        month: 'Noiembrie',
        year: 2024,
        income: 13000,
        expenses: 9000,
      },
    ],
    incomeByCategory: [
      { categoryName: 'Categoria 1', colorCode: '#E5E0FF', income: 5000 },
      { categoryName: 'Categoria 2', colorCode: '#B6BBC4', income: 7000 },
      { categoryName: 'Categoria 3', colorCode: '#CDE8E5', income: 9000 },
    ],
    expensesByCategory: [
      { categoryName: 'Categoria 1', colorCode: '#B9B4C7', expenses: 5000 },
      { categoryName: 'Categoria 2', colorCode: '#BBE9FF', expenses: 7000 },
      { categoryName: 'Categoria 3', colorCode: '#B1AFFF', expenses: 5000 },
    ],
  }

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
  }

  public barChartData: ChartData<'bar'> = {
    labels: this.aggregatedStatistics.cashFlow.map((cf) => cf.month),
    datasets: [
      {
        data: this.aggregatedStatistics.cashFlow.map((cf) => cf.income),
        label: 'Venituri',
        backgroundColor: '#8B93FF',
      },
      {
        data: this.aggregatedStatistics.cashFlow.map((cf) => cf.expenses),
        label: 'Cheltuieli',
        backgroundColor: '#FB7185',
      },
    ],
  }

  // Pie chart options and data for Income by Category
  public pieChartIncomeOptions: ChartOptions<'pie'> = {
    responsive: true,
  }
  public pieChartIncomeData: ChartData<'pie'> = {
    labels: this.aggregatedStatistics.incomeByCategory.map(
      (ic) => ic.categoryName,
    ),
    datasets: [
      {
        data: this.aggregatedStatistics.incomeByCategory.map((ic) => ic.income),
        backgroundColor: this.aggregatedStatistics.incomeByCategory.map(
          (ic) => ic.colorCode,
        ),
      },
    ],
  }

  // Pie chart options and data for Expenses by Category
  public pieChartExpensesOptions: ChartOptions<'pie'> = {
    responsive: true,
  }
  public pieChartExpensesData: ChartData<'pie'> = {
    labels: this.aggregatedStatistics.expensesByCategory.map(
      (ec) => ec.categoryName,
    ),
    datasets: [
      {
        data: this.aggregatedStatistics.expensesByCategory.map(
          (ec) => ec.expenses,
        ),
        backgroundColor: this.aggregatedStatistics.expensesByCategory.map(
          (ec) => ec.colorCode,
        ),
      },
    ],
  }

  dateRangeForm: FormGroup = this.fb.group({
    startDate: [''],
    endDate: [''],
  })

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  onSubmit() {}
}
