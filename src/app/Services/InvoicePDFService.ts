import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { InvoiceDirection } from '../Utilities/Enums';
import { DetailedInvoice } from '../Utilities/Models';

@Injectable({
  providedIn: 'root',
})
export class InvoicePdfService {
  constructor() {}

  generatePdf(invoiceData: DetailedInvoice): void {
    const doc = new jsPDF();

    const { organization, partner, invoice } = invoiceData;
    const isInvoiceIn = invoice.direction === InvoiceDirection.in;
    const provider = isInvoiceIn ? partner : organization;
    const client = isInvoiceIn ? organization : partner;

    // Header
    doc.setFontSize(16);
    doc.text('Factura', doc.internal.pageSize.getWidth() / 2, 10, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Numar factura: ${invoice.invoiceNumber}`, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    doc.text(`Data facturii: ${invoice.invoiceDate.toDateString()}`, doc.internal.pageSize.getWidth() / 2, 25, { align: 'center' });
    doc.text(`Data scadentei: ${invoice.dueDate.toDateString()}`, doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });

    // Provider Information
    doc.setFontSize(12);
    doc.text('Furnizor:', 10, 40);
    doc.setFontSize(10);
    doc.text(`Nume: ${provider.name}`, 10, 45);
    doc.text(`CUI: ${provider.CUI}`, 10, 50);
    doc.text(`Reg. Com.: ${provider.regCom}`, 10, 55);
    doc.text(`Adresa:`, 10, 60);
    doc.text(`${provider.address}`, 10, 65);
    doc.text(`${provider.city}, ${provider.county}`, 10, 70);
    doc.text(`${provider.country}, ${provider.postalCode}`, 10, 75);
    doc.text(`Email: ${provider.email}`, 10, 80);
    doc.text(`Telefon: ${provider.phoneNumber}`, 10, 85);

    // Client Information
    doc.setFontSize(12);
    doc.text('Client:', doc.internal.pageSize.getWidth() - 100, 40);
    doc.setFontSize(10);
    doc.text(`Nume: ${client.name}`, doc.internal.pageSize.getWidth() - 100, 45);
    doc.text(`CUI: ${client.CUI}`, doc.internal.pageSize.getWidth() - 100, 50);
    doc.text(`Reg. Com.: ${client.regCom}`, doc.internal.pageSize.getWidth() - 100, 55);
    doc.text(`Adresa:`, doc.internal.pageSize.getWidth() - 100, 60);
    doc.text(`${client.address}`, doc.internal.pageSize.getWidth() - 100, 65);
    doc.text(`${client.city}, ${client.county}`, doc.internal.pageSize.getWidth() - 100, 70);
    doc.text(`${client.country}, ${client.postalCode}`, doc.internal.pageSize.getWidth() - 100, 75);
    doc.text(`Email: ${client.email}`, doc.internal.pageSize.getWidth() - 100, 80);
    doc.text(`Telefon: ${client.phoneNumber}`, doc.internal.pageSize.getWidth() - 100, 85);

    // Invoice Elements Table
    const elements = invoice.elements?.map(el => [
      el.elementName,
      el.elementDescription,
      el.quantity,
      el.elementPrice.toFixed(2),
      el.elementTax.toFixed(2),
      ((el.elementPrice * el.quantity) * (1 + el.elementTax / 100)).toFixed(2),
    ]) || [];

    (doc as any).autoTable({
      head: [['Nume element', 'Descriere', 'Cantitate', 'Pret', 'Taxa', 'Total']],
      body: elements,
      startY: 95,
    });

    // Total Amount
    const totalWithTax = invoice.elements?.reduce((sum, el) => sum + (el.elementPrice * el.quantity) * (1 + el.elementTax / 100), 0) || 0;
    doc.setFontSize(14);
    doc.text(`Total: ${totalWithTax.toFixed(2)} RON`, 10, (doc as any).previousAutoTable.finalY + 10);

     // Footer
    const footerText1 = 'Factura circula fara semnatura si stampila cf. art.V, alin (2) din Ordonanta nr. 17/2015';
    const footerText2 = 'si art. 319 alin (29) din Leges nr. 227/2015 privind Codul fiscal';
    doc.setFontSize(10);
    doc.text(footerText1, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 20, { align: 'center' });
    doc.text(footerText2, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 15, { align: 'center' });

    // Save the PDF
    doc.save(`Factura_${invoice.invoiceNumber}.pdf`);
  }
}