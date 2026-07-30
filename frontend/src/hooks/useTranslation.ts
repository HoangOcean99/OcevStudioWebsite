import { useLanguageStore } from '../store/useLanguageStore';
import { dictionaries, Dictionary } from '../i18n/dictionaries';

export function useTranslation<T extends keyof Dictionary>(namespace: T) {
  const language = useLanguageStore((state) => state.language);
  
  const t = (key: keyof Dictionary[T]): string => {
    return (dictionaries[language][namespace] as any)[key] || key.toString();
  };

  return { t, language };
}
