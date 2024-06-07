import {Context} from '@matterway/sdk';
import {successStep} from 'steps/@success';
import {gatherPartnerDataStep} from './gatherPartnerDataStep';

// DO NOT add your automation in this step. Rather, create another step from
// `_template.tsx`, and call them here

export async function startStep(ctx: Context) {
  console.log('step: startStep');
  const partnerData = await gatherPartnerDataStep(ctx);
  console.log('partnerData', partnerData);
  // Make a new step from `_template.tsx` and change this line to point to it
  await successStep(ctx);
}
