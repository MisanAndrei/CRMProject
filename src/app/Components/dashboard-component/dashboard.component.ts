import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { CashFlow, Category, CategoryCashFlow } from '../../Utilities/Models';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  categories: Category[] = [];
  selectedCategoryName: string = '';
  selectedCategoryId: number = 0;

  // Sample data for CashFlow
  public cashFlowData: CashFlow[] = [
    { month: 1, collectionsSum: 5000, costsSum: 3000 },
    { month: 2, collectionsSum: 6000, costsSum: 4000 },
    { month: 3, collectionsSum: 7000, costsSum: 2000 },
    { month: 4, collectionsSum: 8000, costsSum: 5000 },
    { month: 5, collectionsSum: 9000, costsSum: 6000 },
    { month: 6, collectionsSum: 10000, costsSum: 7000 },
  ];

  // Sample data for CategoryCashFlow
  public categoryCashFlowData: CategoryCashFlow = {
    id: 1,
    name: 'Category 1',
    collectionsSum: 50000,
    costsSum: 30000
  };

  // Map month numbers to month names
  private monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Bar chart options and data
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
  };
  public barChartData: ChartData<'bar'> = {
    labels: this.cashFlowData.map(cf => this.monthNames[cf.month - 1]),
    datasets: [
      { data: this.cashFlowData.map(cf => cf.collectionsSum), label: 'Collections' },
      { data: this.cashFlowData.map(cf => cf.costsSum), label: 'Costs' }
    ],
  };

  // Pie chart options and data
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };
  public pieChartData: ChartData<'pie'> = {
    labels: ['Collections', 'Costs'],
    datasets: [
      {
        data: [this.categoryCashFlowData.collectionsSum, this.categoryCashFlowData.costsSum],
        backgroundColor: ['#FF6384', '#36A2EB']
      }
    ],
  };

  dateRangeForm: FormGroup = this.fb.group({
    startDate: [''],
    endDate: ['']
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void { 
    this.fetchCategories();
  }

  fetchCategories() {
    // Replace with API call
    this.categories = [
      { id: 1, name: 'Category 1', type: 'Type 1', colorCode: '#FF0000' },
      { id: 2, name: 'Category 2', type: 'Type 2', colorCode: '#00FF00' },
    ];
  }

  onCategorySelected(categoryId: number) {
    const selectedCategory = this.categories.find(category => category.id === categoryId);
    if (selectedCategory) {
      this.selectedCategoryId = selectedCategory.id!;
      this.selectedCategoryName = selectedCategory.name!;
    }
  }

  onSubmit(): void {

    const startDate = this.dateRangeForm.get('startDate')?.value;
    const endDate = this.dateRangeForm.get('endDate')?.value;

    console.log(`Submitted Start Date: ${startDate}`);
    console.log(`Submitted End Date: ${endDate}`);
    console.log(`Category ID: ${this.selectedCategoryId}`);
    console.log(`Category Name: ${this.selectedCategoryName}`);
  }

}