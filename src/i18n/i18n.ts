import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./languages/en.json";
import it from "./languages/it.json";
import ja from "./languages/ja.json";
import es from "./languages/es.json";
import fr from "./languages/fr.json";
import pt from "./languages/pt.json";
import ru from "./languages/ru.json";
import tr from "./languages/tr.json";
import de from "./languages/de.json";
import el from "./languages/el.json";
import zh from "./languages/zh.json";

const resources = {
  en: { translation: en, name: "English" },
  it: { translation: it, name: "Italiano" },
  ja: { translation: ja, name: "日本語" },
  es: { translation: es, name: "Español" },
  fr: { translation: fr, name: "Français" },
  pt: { translation: pt, name: "Português" },
  ru: { translation: ru, name: "Русский" },
  tr: { translation: tr, name: "Türkçe" },
  de: { translation: de, name: "Deutsch" },
  el: { translation: el, name: "Ελληνικά" },
  zh: { translation: zh, name: "中文" },
} as const;

type SupportedLanguage = keyof typeof resources;
export const SUPPORTED_LANGUAGES = Object.keys(resources) as SupportedLanguage[];
export const languageNames = Object.fromEntries(
  Object.entries(resources).map(([key, value]) => [key, value.name])
);

void i18n.use(initReactI18next).init({
  resources,
  supportedLngs: SUPPORTED_LANGUAGES,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
  returnEmptyString: false,
});

export default i18n;
