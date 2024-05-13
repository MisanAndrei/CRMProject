export interface Element {
    id: number;
    nume: string;
    categorie: string;
    culoare?: string;
    taxe: string;
    pretAchizitie: number;
    pretVanzare: number;
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
    id: number;
    name: string;
    type: string;
    color: string;
  }

  export interface Currency {
    id: number;
    name: string;
    code: string;
    symbol: string;
    rate: number;
  }

  export interface Tax {
    id: number;
    name: string;
    type?: string;
    percent?: number;
  }