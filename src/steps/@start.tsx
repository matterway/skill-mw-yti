import {Context, showMessage} from '@matterway/sdk';
import {t} from 'i18next';
import manifest from 'manifest.json';
import {successStep} from 'steps/@success';

// DO NOT add your automation in this step. Rather, create another step from
// `_template.tsx`, and await it at the end of this step.

export async function startStep(ctx: Context) {
  console.log('step: startStep');

  await showMessage(ctx, {
    title: manifest.name,
    description: manifest.description,
    text: t('start.text'),
    buttons: [{text: t('start.proceedButton'), value: 'ok'}],
  });

  // Make a new step from `_template.tsx` and change this line to point to it
  await successStep(ctx);
}
