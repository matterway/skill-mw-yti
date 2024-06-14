import {Context} from '@matterway/sdk';
import {successStep} from 'steps/@success';
import {gatherPartnerDataStep} from './gatherPartnerDataStep';
import {fillInvoicePdfStep} from './fillInvoicePdf';
import {verifyValuesUIStep} from './verifyValuesUI';
import {downloadFileStep} from './downloadFile';

// DO NOT add your automation in this step. Rather, create another step from
// `_template.tsx`, and call them here

export async function startStep(ctx: Context) {
  console.log('step: startStep');
  const partnerData = await gatherPartnerDataStep(ctx);
  const updatedPartnerData = await verifyValuesUIStep(ctx, partnerData);
  const filledPdf = await fillInvoicePdfStep(ctx, updatedPartnerData);
  await downloadFileStep(ctx, filledPdf, updatedPartnerData.companyName);
  await successStep(ctx, updatedPartnerData.companyName);
}
