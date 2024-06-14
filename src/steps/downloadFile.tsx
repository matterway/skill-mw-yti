import {Context, convertBase64ToFile, downloadFile} from '@matterway/sdk';
import {uint8ToBase64} from 'shared/utils';

export async function downloadFileStep(
  ctx: Context,
  pdf: Uint8Array,
  companyName: string,
) {
  console.log('step: downloadFileStep start');

  const base64File = uint8ToBase64(pdf);

  const sdkFile = convertBase64ToFile(
    base64File,
    `Invoice-${companyName}`,
    'application/pdf',
  );
  await downloadFile(ctx, sdkFile);
  console.log('step: downloadFileStep end');
}
