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