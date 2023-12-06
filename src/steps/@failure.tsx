import {Context, showFailureNotice} from '@matterway/sdk';
import {t} from 'i18next';
import manifest from 'manifest.json';

export async function failureStep(ctx: Context, err: Error) {
  console.log('Step: failureStep');

  await showFailureNotice(ctx, {
    title: manifest.name,
    description: manifest.description,
    subtitle: t('failure.subtitle'),
    text: t('failure.text', {err: err.message}),
    buttons: [{text: t('failure.dismissButton'), value: 'ok'}],
  });
}
