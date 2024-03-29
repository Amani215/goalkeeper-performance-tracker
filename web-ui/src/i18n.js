import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const fallbackLng = ['en']
const availableLng = ['en', 'fr']

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        // resources,
        fallbackLng,
        detection:{
            checkWhitelist: true
        },
        debug: false,
        whitelist: availableLng,
        interpolation:{
            escapeValue: false
        }
    });

export default i18n;
