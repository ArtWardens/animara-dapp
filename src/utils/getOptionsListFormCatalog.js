import i18n from 'i18next';

import {
  HOME_EN,
  LANGUAGE_EN,
  LOGIN_EN,
} from '../i18n/en';


export const DictionariesTranslationsMap = {
  language: 'Language',
  home: 'Home',
  login:'Login'
};

export const getOptionListFromCatalog = (name, disabledOptions) => {
  let keysList = [];

  if (!name) return;
  switch (true) {
  
    case name ==='Home':
      keysList = Object.keys(HOME_EN);
      break;
      case name === 'Language':
        keysList = Object.keys(LANGUAGE_EN);
        break;
        case name === 'Login':
          keysList = Object.keys(LOGIN_EN);
          break;
        default: 
  }

  return keysList.map((code, index) =>
    disabledOptions
      ? {
          label: i18n.t(`${name}:${code}`),
          value: code,
          disabled: disabledOptions && disabledOptions.includes(index),
        }
      : {
          label: i18n.t(`${name}:${code}`),
          value: code,
        },
  );
};

export const getCodeValueFromCatalog = (key, value) => {
  return i18n.t(`${DictionariesTranslationsMap[key]}:${value}`);
};
