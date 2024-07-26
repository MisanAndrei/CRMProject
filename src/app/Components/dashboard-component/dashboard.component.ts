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
  Partner,
  CashFlowByPartner,
} from '../../Utilities/Models'
import { ApiService } from '../../Services/ApiService'
import { firstValueFrom } from 'rxjs/internal/firstValueFrom'
import { HttpParams } from '@angular/common/http'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  selectedPartnerId!: number;
  partners: Partner[] = [];
  aggregatedStatistics!: AggregatedStatistics;

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
  }

  public barChartData!: ChartData<'bar'>;

  // Pie chart options and data for Income by Category
  public pieChartIncomeOptions: ChartOptions<'pie'> = {
    responsive: true,
  }
  public pieChartIncomeData!: ChartData<'pie'>;

  // Pie chart options and data for Expenses by Category
  public pieChartExpensesOptions: ChartOptions<'pie'> = {
    responsive: true,
  }
  public pieChartExpensesData!: ChartData<'pie'>;

  dateRangeForm: FormGroup = this.fb.group({
    startDate: [''],
    endDate: [''],
  })

  constructor(private fb: FormBuilder, private apiService: ApiService) {}

  ngOnInit(): void {
    this.setDefaultDates();
    this.fetchData();
    this.fetchPartnersData();
  }

  onSubmit() {
    this.fetchData();
    
  }

  fetchPartnersData(){
    this.apiService.get<Partner[]>('partner/').subscribe({
      next: (data: Partner[]) => {
        this.partners = data;
        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching partners', error);
      },
      complete: () => {
        console.info('partners data fetch complete');
      }
    });
  }

  fetchData(){
    let queryParameters = new HttpParams();
    queryParameters = queryParameters.append('fromDate', this.formatDate(this.dateRangeForm.value.startDate));
    queryParameters = queryParameters.append('toDate', this.formatDate(this.dateRangeForm.value.endDate)); 

    this.apiService.get<AggregatedStatistics>('reporting/dashboard/', queryParameters).subscribe({
      next: (data: AggregatedStatistics) => {
        this.aggregatedStatistics = data;
        console.log(data);
        this.updateCharts();
      },
      error: (error) => {
        console.error('Error fetching elements', error);
      },
      complete: () => {
        console.info('elements data fetch complete');
      }
    });

    this.getPartnerData();
  }

  getPartnerData() {
    let queryParameters = new HttpParams();
    queryParameters = queryParameters.append('fromDate', this.formatDate(this.dateRangeForm.value.startDate));
    queryParameters = queryParameters.append('toDate', this.formatDate(this.dateRangeForm.value.endDate)); 
    if (this.selectedPartnerId) {
      this.apiService.get<CashFlowByPartner>(`reporting/dashboard/partner/${this.selectedPartnerId}`, queryParameters).subscribe({
        next: (data: CashFlowByPartner) => {
          this.aggregatedStatistics.cashFlowByPartner = data;
          console.log(data);
          this.updatePartnerChart();
        },
        error: (error) => {
          console.error('Error fetching elements', error);
        },
        complete: () => {
          console.info('elements data fetch complete');
        }
      });
    }
  }

  updateCharts() {
    this.updateBarChart();
    this.updateIncomePieChart();
    this.updateExpensesPieChart();
  }

  updateBarChart() {
    this.barChartData = {
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
    };
  }

  updateIncomePieChart() {
    this.pieChartIncomeData = {
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
    };
  }

  updateExpensesPieChart() {
    this.pieChartExpensesData = {
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
    };
  }

  updatePartnerChart() {
    // Implement the logic to update the partner-specific chart here
    // This method will be called when partner data is fetched
  }

  setDefaultDates(): void {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 6);

    this.dateRangeForm.patchValue({
      startDate: startDate,
      endDate: endDate,
    });
  }

  formatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
}