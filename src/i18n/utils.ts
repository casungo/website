import { ui, defaultLang } from "./ui";

export type UiLang = keyof typeof ui;
export type UiKey = keyof (typeof ui)[UiLang] | keyof (typeof ui)[typeof defaultLang];

function getNestedValue(obj: any, path: string): string | undefined {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

export function useTranslations(lang: UiLang | undefined) {
  const effectiveLang = lang && lang in ui ? lang : defaultLang;
  return function t(key: string): string {
    return getNestedValue(ui[effectiveLang], key) ?? getNestedValue(ui[defaultLang], key) ?? key;
  };
}
