import {Context} from '@matterway/sdk';
import {initI18n} from 'locales';
import {failureStep} from 'steps/@failure';
import {startStep} from 'steps/@start';

export default async function (ctx: Context) {
  console.clear();
  initI18n(ctx.languageCode);

  try {
    await startStep(ctx);
  } catch (err) {
    console.error(err);

    await failureStep(ctx, err as Error);

    throw err;
  }
}
