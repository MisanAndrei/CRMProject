import { jsPDF } from 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    previousAutoTable: any;
    autoTable: (options: any) => jsPDF;
  }
}