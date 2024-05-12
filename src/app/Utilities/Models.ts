export interface Element {
    id: number;
    nume: string;
    categorie: string;
    culoare?: string;
    taxe: string;
    pretAchizitie: number;
    pretVanzare: number;
  }

  export interface Tax {
    id: number;
    name: string;
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