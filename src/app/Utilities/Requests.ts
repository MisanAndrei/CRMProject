export interface CompanySettingsRequest {
	name: string;
	email: string;
	phone: string;
	cui: string;
	address: string;
	city: string;
	county: string;
	postalCode: string;
	country: string;
    }

export interface BillPreferencesRequest {
	prefix: string;
	nextNumber: number;
	numberOfDecimals: number;
	title: string;
	note: string;
	subHeader: string;
	footer: string;
	}

export interface ImplicitRequest {
    accountId: number;
    taxId: number;
    payingMethodAccountId: number;
    numberOfItemsPerPage: number;
    incomeCategoryId: number;
    expenseCategoryId: number;
    }

export interface ElementUpsertRequest {
    id?: number;
	productServiceType: number;
	name: string;
	categoryId: number;
	acquireInfoValue: number;
	sellingInfoValue: number;
	description: string;
	taxId: number;
	}

export interface PartnerUpsertRequest {
	id?: number;
	name: string;
	email: string;
	phone: string;
	website: string;
	reference: string;
	image: string;
	cui: string;
	address: string;
	postalCode: string;
	county: string;
	city: string;
	}

export interface AccountUpsertRequest {
	name: string;
	number: string;
	initialSold: number;
	bankName: string;
	bankPhone: string;
	bankAddress: string;
	}

 
