import type {Context} from '@matterway/sdk';
import {showSuccessNotice} from '@matterway/sdk';
import {t} from 'i18next';
import manifest from 'manifest.json';

// You can duplicate this step to represent different endings for this task
// which are not "technical errors", such as "could not find the material".

export async function successStep(ctx: Context, companyName: string) {
  console.log('step: successStep');

  // Only add logic here if it is performing closure specific to this ending

  await showSuccessNotice(ctx, {
    title: manifest.name,
    description: manifest.description,
    subtitle: t('success.subtitle'),
    statuses: [
      {status: 'success', text: t('success.text1', {companyName})},
      {status: 'success', text: t('success.text2')},
    ],
  });
}
