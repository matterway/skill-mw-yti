import {Context} from '@matterway/sdk';
import {successStep} from 'steps/@success';
import {gatherPartnerDataStep} from './gatherPartnerDataStep';
import {fillInvoicePdfStep} from './fillInvoicePdf';

// DO NOT add your automation in this step. Rather, create another step from
// `_template.tsx`, and call them here

export async function startStep(ctx: Context) {
  console.log('step: startStep');
  const partnerData = await gatherPartnerDataStep(ctx);
  const filledPdf = await fillInvoicePdfStep(ctx, partnerData);
  console.log('filledPdf', filledPdf);
  await successStep(ctx);
}
