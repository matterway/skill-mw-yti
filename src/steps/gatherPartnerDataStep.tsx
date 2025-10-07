import {Context, click, getValue, waitForSelector} from '@matterway/sdk';
import {showUI} from '@matterway/sdk/lib/UIv2';
import {t} from 'i18next';
import {commentRegex, serviceRegex, servicesData} from 'shared/constants';
import {SELECTORS} from 'shared/selectors';
import {PartnerData} from 'shared/types';

export async function gatherPartnerDataStep(ctx: Context) {
  console.log('step: gatherPartnerDataStep');

  void showUI.progress(ctx, t('loader.text'), {overlay: true});

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
  const commentsText = (
    await getValue(ctx, SELECTORS.comments)
  )?.trim() as string;
  const comments = commentsText.match(commentRegex) as string[];

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

  const services = comments.map((service) => {
    const match = service.match(serviceRegex) as string[];

    const description = match[1];
    const totalDays = match[2];
    const discount = match[3] || '0';

    const id = servicesData[description as keyof typeof servicesData].id;
    const dailyRate =
      servicesData[description as keyof typeof servicesData].dailyRate;
    const lineTotal = discount
      ? (
          Number(totalDays) *
          Number(dailyRate.replace(',', '.')) *
          (1 - Number(discount.replace(',', '.')) / 100)
        ).toFixed(2)
      : (Number(totalDays) * Number(dailyRate.replace(',', '.'))).toFixed(2);
    return {
      id,
      description,
      totalDays,
      discount,
      dailyRate,
      lineTotal,
    };
  });
  const totalDiscount = services.reduce((acc, service) => {
    return acc + Number(service.discount.replace(',', ''));
  }, 0);
  const subTotal = services.reduce((acc, service) => {
    return acc + Number(service.lineTotal);
  }, 0);

  const total = subTotal * (1 - totalDiscount / 100);

  const partnerData: PartnerData = {
    companyName,
    primaryEmail,
    TaxId,
    contactPersonFirstName,
    contactPersonLastName,
    contactPersonEmail,
    contactPersonPhone,
    services,
    streetAddress,
    officeNumber,
    buildingNumber,
    city,
    country,
    postalCode,
    totalDiscount,
    subTotal,
    total,
  };

  console.log('step: gatherPartnerDataStep end', partnerData);
  return partnerData;
}
