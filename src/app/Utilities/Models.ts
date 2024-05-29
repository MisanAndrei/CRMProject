export interface Element {
  id?: number;
  type: string;
  name: string;
  categoryName: string;
  categoryId: number;
  description?: string;
  aquisitionPrice?: number;
  sellingPrice?: number;
  taxValue: number;
  taxId: number;
  
  }

  export interface Partner {
    id: number;
    name: string;
    cui: string;
    email: string;
    phoneNumber: string;
    country: string;
    bill: string;
  }

  export interface Bill {
    id: number;
    dateOfBill: string;
    maturityOfBill: string;
    status: string;
    partner: string;
    number: string;
    sum: string; 
  }

  export interface Account {
    id: number;
    name: string;
    bankName: string;
    phone: string;
    sold: string;
  }

  export interface Transaction {
    id: number;
    date: string;
    number: string;
    type: string;
    category: string;
    account: string;
    contact: string;
    document: string;
    sum: string;
  }

  export interface Category {
    id?: number;
    name: string;
    type: string;
    colorCode: string;
  }

  export interface Currency {
    id: number;
    name: string;
    code: string;
    symbol: string;
    rate: number;
  }

  export interface Tax {
    id?: number;
    name: string;
    type?: string;
    value?: number;
  }

  export interface Transfer {
    id: number;
    payingAccount: string;
    receivingAccount: string;
    sum: number;
    date: string;
  }

  export interface CashFlow {
    month: number;
    collectionsSum: number;
    costsSum: number;
  }

  export interface CategoryCashFlow {
    id: number;
    name: string;
    collectionsSum: number;
    costsSum: number;
  }

  export interface Organization {
    name: string;
    tenantId: string;
    license: string;
    dbSchema: string;
    status: string;
    colorCode: string;
  }