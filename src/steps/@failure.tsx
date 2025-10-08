import {Context} from '@matterway/sdk';
import {showUI} from '@matterway/sdk/lib/UIv2';
import {t} from 'i18next';

export async function failureStep(ctx: Context, err: Error) {
  console.log('Step: failureStep');

  await showUI.failure(ctx, {
    title: t('failure.subtitle'),
    text: t('failure.text', {err: err.message}),
    buttons: [{text: t('failure.dismissButton'), value: 'ok'}],
  });
}
