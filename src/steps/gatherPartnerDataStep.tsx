import {
  Context,
  click,
  getValue,
  showProgress,
  waitForSelector,
} from '@matterway/sdk';
import {t} from 'i18next';
import {SELECTORS} from 'shared/selectors';
import {PartnerData} from 'shared/types';

export async function gatherPartnerDataStep(ctx: Context) {
  console.log('step: gatherPartnerDataStep');

  await showProgress(ctx, t('loader.text'));

  const companyName = (
    await getValue(ctx, SELECTORS.partnerRowData('2'))
  )?.trim() as string;
  const primaryEmail = (
    await getValue(ctx, SELECTORS.partnerRowData('3'))
  )?.trim() as string;
  const TaxId = (
    await getValue(ctx, SELECTORS.partnerRowData('5'))
  )?.trim() as string;

  await click(ctx, SELECTORS.partnerRowData('2'));
  await waitForSelector(ctx, SELECTORS.contactPersonFirstName);
  const contactPersonFirstName = (
    await getValue(ctx, SELECTORS.contactPersonFirstName)
  )?.trim() as string;
  const contactPersonLastName = (
    await getValue(ctx, SELECTORS.contactPersonLastName)
  )?.trim() as string;
  const contactPersonEmail = (
    await getValue(ctx, SELECTORS.contactPersonEmail)
  )?.trim() as string;
  const contactPersonPhone = (
    await getValue(ctx, SELECTORS.contactPersonPhone)
  )?.trim() as string;
  const comments = (await getValue(ctx, SELECTORS.comments))?.trim() as string;

  await click(ctx, SELECTORS.detailsTab);

  await waitForSelector(ctx, SELECTORS.streetAddress);
  const streetAddress = (
    await getValue(ctx, SELECTORS.streetAddress)
  )?.trim() as string;
  const officeNumber = (
    await getValue(ctx, SELECTORS.officeNumber)
  )?.trim() as string;
  const buildingNumber = (
    await getValue(ctx, SELECTORS.buildingNumber)
  )?.trim() as string;
  const city = (await getValue(ctx, SELECTORS.city))?.trim() as string;
  const country = (await getValue(ctx, SELECTORS.country))?.trim() as string;
  const postalCode = (
    await getValue(ctx, SELECTORS.postalCode)
  )?.trim() as string;

  const partnerData: PartnerData = {
    companyName,
    primaryEmail,
    TaxId,
    contactPersonFirstName,
    contactPersonLastName,
    contactPersonEmail,
    contactPersonPhone,
    comments,
    streetAddress,
    officeNumber,
    buildingNumber,
    city,
    country,
    postalCode,
  };

  console.log('step: gatherPartnerDataStep end', partnerData);
  return partnerData;
}
