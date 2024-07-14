import { InvoiceDirection, TransactionDirection } from "./Enums";

export interface Element {
  id?: number;
  type: string;
  name: string;
  categoryName: string;
  categoryId: number;
  description?: string;
  acquisitionPrice?: number;
  sellingPrice?: number;
  taxValue?: number;
  taxId?: number;
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
    id?: number;
    name: string;
    accountNumber: string;
    description?: string;
    sold: number;
  }

  export interface Transaction {
    id?: number;
    paymentDate: Date;
    invoiceId?: number;
    reference?: string;
    amount: number;
    paymentDirection: TransactionDirection;
    bankAccountId: number;
    paymentMethod: string;
    description: string;
    categoryId?: number;
    categoryName?: string;
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
    id?: number;
    date: Date;
    amount: number;
    fromBankAccountId: number;
    fromBankAccountName?: string;
    toBankAccountId: number;
    toBankAccountName?: string;
    description?: string;
    paymentMethod: string;
    reference?: string;
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

  export interface OrganizationResponse {
    name: string;
    tenantId: string;
    license: string;
    dbSchema: string;
    status: string;
    colorCodeNavBar: string;
    colorLeftSideBar: string;
    font: string;
    version: number;
    id: number;
  }
  
  export interface Partner {
    id: number;
    name: string;
    cui: string;
    regCom: string;
    email: string;
    phoneNumber?: string;
    country: string;
    website?: string;
    reference?: string;
    address: string;
    city: string;
    county?: string;
    postalCode: string;
    image?: string;
  }

  export interface Organization {
    name: string;
    email: string;
    phoneNumber: string;
    cui: string;
    regCom: string;
    address: string;
    city: string;
    image: string;
    postalCode: string;
    county: string;
    country: string;
    colorCodeNavBar: string;
    colorCodeLeftBar: string;
    font: string;
  }

  export interface InvoiceElement {
    elementId: number;
    elementName: string;
    elementPrice: number;
    elementDescription: string;
    elementTax: number;
    quantity: number;
  }

  export interface Invoice {
    id?: number;
    total: number;
    partnerId: number;
    partnerName: string;
    categoryId?: number;
    categoryName?: string;
    invoiceNumber: string;
    orderNumber: string;
    direction: InvoiceDirection;
    invoiceDate: Date;
    dueDate: Date;
    completed?: boolean;
    remainingAmount?: number;
    elements?: InvoiceElement[];

  }


  //tablou de bord

  export interface AggregatedStatistics {
    accountsSold: AccountSoldItem[];
    receivables: Receivables;
    payables: Payables;
    cashFlow: CashFlowItem[];
    incomeByCategory: IncomeByCategoryItem[];
    expensesByCategory: ExpensesByCategoryItem[];
    cashFlowByPartner?: CashFlowByPartner;
  }

  export interface CashFlowByPartner {
    partnerName: string;
    totalReceived: number;
    totalPaid: number;
  }

  export interface Receivables {
    totalToReceive: number;
    totalOpen: number;
    totalOverdue: number;
  }

  export interface Payables {
    totalToPay: number;
    totalOpen: number;
    totalOverdue: number;
  }

  export interface AccountSoldItem {
    accountName: string;
    totalSold: number;
  }

  export interface CashFlowItem {
    month: string;
    year: number;
    income: number;
    expenses: number;
  }

  export interface IncomeByCategoryItem {
    categoryName: string;
    colorCode: string;
    income: number;
  }

  export interface ExpensesByCategoryItem {
    categoryName: string;
    colorCode: string;
    expenses: number;
  }

  //invoice preferences

  export interface InvoicePreferences {
    prefix: string;
    startingNumber: number;
    notes: string;
    subHeader: string;
    footer: string;
  }

  export interface DetailedInvoice {
    organization: Organization;
    partner: Partner;
    invoice: Invoice;
  }