import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './config';

i18n.use(initReactI18next).init({
  lng: 'en',
  ns: ['common', 'home', 'language', 'login'],
  fallbackLng: 'en',
  nsSeparator: ':',
  interpolation: {
    escapeValue: false,
  },
  resources,
});
