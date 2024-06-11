import {Context} from '@matterway/sdk';
import {PDFDocument} from 'pdf-lib';
import {invoicePdf} from 'shared/invoicePdf';
import {PartnerData} from 'shared/types';

export async function fillInvoicePdfStep(
  ctx: Context,
  partnerData: PartnerData,
) {
  console.log('step: fillInvoicePdfStep start');
  const existingPdfBytes = Uint8Array.from(atob(invoicePdf), (c) =>
    c.charCodeAt(0),
  );
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const form = pdfDoc.getForm();

  const companyName = form.getTextField('companyName');
  const contactName = form.getTextField('contactName');
  const email = form.getTextField('email');
  const address = form.getTextField('address');
  const phone = form.getTextField('phoneNumber');
  const invoiceNumber = form.getTextField('invoiceNumber');
  const date = form.getTextField('date');
  const taxId = form.getTextField('taxId');
  const totalDiscount = form.getTextField('totalDiscount');
  const subtotal = form.getTextField('subtotal');
  const salesTax = form.getTextField('salesTax');
  const total = form.getTextField('total');

  companyName.setText(partnerData.companyName);
  contactName.setText(
    `To ${partnerData.contactPersonFirstName} ${partnerData.contactPersonLastName}`,
  );
  email.setText(partnerData.contactPersonEmail);

  address.setText(`Office ${partnerData.officeNumber}, ${partnerData.buildingNumber}
${partnerData.streetAddress},
${partnerData.city} ${partnerData.postalCode}, ${partnerData.country}`);

  phone.setText(partnerData.contactPersonPhone);
  invoiceNumber.setText(`${Math.floor(10000 + Math.random() * 90000)}`);
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  date.setText(`${dd}.${mm}.${yyyy}`);

  taxId.setText(partnerData.TaxId);
  totalDiscount.setText(`%${partnerData.totalDiscount}`);
  subtotal.setText(`$${partnerData.subTotal}`);
  salesTax.setText('$0,00');
  total.setText(`$${partnerData.total}`);

  partnerData.services.forEach((service, index) => {
    const description = form.getTextField(`description${index + 1}`);
    const totalDays = form.getTextField(`totalDays${index + 1}`);
    const discount = form.getTextField(`discount${index + 1}`);
    const dailyRate = form.getTextField(`dailyRate${index + 1}`);
    const lineTotal = form.getTextField(`lineTotal${index + 1}`);
    const serviceId = form.getTextField(`serviceId${index + 1}`);
    description.setText(service.description);
    totalDays.setText(service.totalDays);
    discount.setText(`%${service.discount}`);
    dailyRate.setText(`$${service.dailyRate}`);
    lineTotal.setText(`$${service.lineTotal}`);
    serviceId.setText(`${service.id}`);
  });

  const pdfBytes = await pdfDoc.save();
  console.log('step: fillInvoicePdfStep end');
  return pdfBytes;
}
