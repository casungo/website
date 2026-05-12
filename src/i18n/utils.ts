import { ui, defaultLang } from "./ui";

export type UiLang = keyof typeof ui;
export type UiKey = keyof (typeof ui)[UiLang] | keyof (typeof ui)[typeof defaultLang];

function getNestedValue(obj: unknown, path: string): string | undefined {
  const value = path.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }

    return undefined;
  }, obj);

  return typeof value === "string" ? value : undefined;
}

export function useTranslations(lang: UiLang | undefined) {
  const effectiveLang = lang && lang in ui ? lang : defaultLang;
  return function t(key: string): string {
    return getNestedValue(ui[effectiveLang], key) ?? getNestedValue(ui[defaultLang], key) ?? key;
  };
}
