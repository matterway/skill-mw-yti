import {
  BackgroundReact as React,
  getContentComponentsProxy,
} from '@matterway/background-react';
import {Context} from '@matterway/sdk';
import {
  showUI,
  bubble,
  headerBar,
  inputField,
  group,
  navigationBar,
} from '@matterway/sdk/lib/UIv2';
import {t} from 'i18next';
import {PartnerData, ServiceFormResult} from 'shared/types';
const {LinkCallout} = getContentComponentsProxy<typeof import('components')>();

export async function verifyValuesUIStep(
  ctx: Context,
  partnerData: PartnerData,
) {
  console.log('step: verifyValuesUIStep start');

  const {services} = partnerData;

  const formInitailValues: {[key: string]: string} = {};

  const form: any = await showUI(
    ctx,
    bubble([
      headerBar({
        title: t('form.title', {companyName: partnerData.companyName}),
        description: t('form.description'),
      }),
      group([
        <LinkCallout text={t('form.infoText')} linkText={t('form.linkText')} />,
        ...services.map((service, index) => {
          return inputField({
            label: `Total Days ${service.description}`,
            name: `totalDays${index}`,
            defaultValue: service.totalDays,
          });
        }),
        ...services.map((service, index) => {
          return inputField({
            label: `Discount ${service.description}`,
            name: `discount${index}`,
            defaultValue: service.discount,
          });
        }),
      ]),
      navigationBar({buttons: [{value: 'ok', text: 'Submit'}]}),
    ]),
  );
  const data = form.state as ServiceFormResult['data'];

  if (JSON.stringify(data) !== JSON.stringify(formInitailValues)) {
    // update partnerData with the new values
    partnerData.services = services.map((service, index) => {
      const totalDays = data[`totalDays${index}`];
      const discount = data[`discount${index}`];
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
