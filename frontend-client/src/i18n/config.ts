import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

import en from "../locales/en.json"
import vi from "../locales/vi.json"

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        vi: { translation: vi },
        en: { translation: en },
      },
      fallbackLng: "vi",
      detection: {
        order: ["localStorage", "cookie", "navigator"],
        caches: ["localStorage"],
        lookupLocalStorage: "itjob_lang",
      },
      interpolation: {
        escapeValue: false,
      },
    })
}

export default i18n
