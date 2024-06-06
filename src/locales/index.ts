import {AvailableLanguagesCodes} from '@matterway/types';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import commonEn from './en.json';

export type LocaleResources = typeof commonEn;

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'commonEn';
    resources: {
      commonEn: LocaleResources;
    };
  }
}

export function initI18n(lng: AvailableLanguagesCodes) {
  i18n
    .use(initReactI18next)
    .init({
      lng,
      debug: false,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      resources: {
        en: {translation: commonEn},
      },
      saveMissing: false,
    })
    .catch((error) => {
      console.error(error);
    });
}
