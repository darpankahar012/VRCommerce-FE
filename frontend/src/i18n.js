import i18n from 'i18next'
import {initReactI18next} from 'react-i18next';
import common_en from './translation/en.json';
import common_hi from './translation/hi.json';

const resources = {
    en: {
        translation: common_en
    },
    hi: {
        translation: common_hi
    }
}

i18n
.use(initReactI18next)
.init({
    resources: resources,
    lng: 'en',
    keySeparator: false,
    interpolation: {
        escapeValue: false
      }
})

export default i18n