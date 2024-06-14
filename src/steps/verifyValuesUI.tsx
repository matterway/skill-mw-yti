import {
  BackgroundReact as React,
  getContentComponentsProxy,
} from '@matterway/background-react';
import {Context, FieldSchema, ShowFormOptions, showForm} from '@matterway/sdk';
import {t} from 'i18next';
import {PartnerData, ServiceFormResult} from 'shared/types';
const {LinkCallout} = getContentComponentsProxy<typeof import('components')>();

export async function verifyValuesUIStep(
  ctx: Context,
  partnerData: PartnerData,
) {
  console.log('step: verifyValuesUIStep start');

  const {services} = partnerData;
  const totalDaysFields: FieldSchema[] = [];
  const discountFields: FieldSchema[] = [];
  const formInitailValues: {[key: string]: string} = {};

  services.forEach((service, index) => {
    totalDaysFields.push({
      type: 'text',
      label: `Total Days ${service.description}`,
      name: `totalDays${index}`,
    });
    formInitailValues[`totalDays${index}`] = service.totalDays;
  });
  services.forEach((service, index) => {
    discountFields.push({
      type: 'text',
      label: `Discount ${service.description}`,
      name: `discount${index}`,
    });
    formInitailValues[`discount${index}`] = service.discount;
  });

  const formOptions: ShowFormOptions = {
    title: t('form.title', {companyName: partnerData.companyName}),
    description: t('form.description'),
    initialData: formInitailValues,
    fields: [
      {
        type: 'group',
        fields: [
          {
            type: 'statictext',
            text: (
              <LinkCallout
                text={t('form.infoText')}
                linkText={t('form.linkText')}
              />
            ),
          },
          ...totalDaysFields,
          ...discountFields,
        ],
      },
    ],
    buttons: [{value: 'ok', text: 'Submit'}],
  };

  const data = (await showForm(ctx, formOptions)) as ServiceFormResult;

  if (JSON.stringify(data.data) !== JSON.stringify(formInitailValues)) {
    // update partnerData with the new values
    partnerData.services = services.map((service, index) => {
      const totalDays = data.data[`totalDays${index}`];
      const discount = data.data[`discount${index}`];
      const lineTotal = (
        parseFloat(totalDays) *
        parseFloat(service.dailyRate.replace(',', '.')) *
        (1 - parseFloat(discount.replace(',', '.')) / 100)
      ).toFixed(2);
      return {
        ...service,
        totalDays,
        discount,
        lineTotal,
      };
    });
    partnerData.totalDiscount = partnerData.services.reduce((acc, service) => {
      return acc + Number(service.discount.replace(',', ''));
    }, 0);
    partnerData.subTotal = partnerData.services.reduce((acc, service) => {
      return acc + Number(service.lineTotal);
    }, 0);

    partnerData.total =
      partnerData.subTotal * (1 - partnerData.totalDiscount / 100);
  }
  console.log('step: verifyValuesUIStep end');
  return partnerData;
}
