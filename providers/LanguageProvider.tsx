import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import i18n, { resources } from '@/i18n';
import { storage } from '@/utils/storage';

// Update this type if you add more languages to resources
type Language = keyof typeof resources;

interface LanguageContextValue {
  language: Language;
  setLanguage: (lng: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'en',
  setLanguage: () => {},
});

export const LanguageProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>(
    i18n.language as Language,
  );

  useEffect(() => {
    (async () => {
      const saved = await storage.getLanguage();
      if (saved && saved !== language) {
        await i18n.changeLanguage(saved);
        setLanguageState(saved as Language);
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setLanguage = useCallback(async (lng: Language) => {
    await i18n.changeLanguage(lng);
    await storage.setLanguage(lng);
    setLanguageState(lng);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
