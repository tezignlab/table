import { createContext } from 'react';

type TLocaleContext = {
    translate: (key: string) => string
    locale: string;
    setLocale: (locale: 'en' | 'zh') => void
}

export const LocaleHander = {
    locale: 'en',
    setLocale: (locale: 'en' | 'zh') => {},
    translate: (key: string) => 'en',
}

export const LocaleContext = createContext<TLocaleContext>(LocaleHander);