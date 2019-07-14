// @flow

export type Language = 'EN' | 'HR'

export const LANGUAGE: {
  [string]: {
    id: Language,
    name: string,
  },
} = {
  EN: {
    id: 'EN',
    name: 'English',
  },
  HR: {
    id: 'HR',
    name: 'Croatian',
  },
}

export const LANGUAGES: Array<Language> = [LANGUAGE.EN.id, LANGUAGE.HR.id]

export const LOCALE: {
  [string]: string,
} = {
  EN: 'en_US',
  HR: 'hr_HR',
}

const STORAGE_KEY = 'language'
export function storeLanguage(language: Language) {
  localStorage.setItem(STORAGE_KEY, language)
}
export function getStoredLanguage(): ?Language {
  // $FlowFixMe: Flow doesn't know about LocalStorage
  return localStorage.getItem(STORAGE_KEY)
}
export function clearStoredLanguage() {
  localStorage.removeItem(STORAGE_KEY)
}
