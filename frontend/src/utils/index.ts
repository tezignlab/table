export const delHtmlTag = (text: string): string => {
  return text.replace(/<(?!img).*?>/g, '')
}

export interface GlobalLoadingState {
  global: boolean
  models: {
    auth: boolean
    calendar: boolean
    collections: boolean
    currentUser: boolean
    searchGraph: boolean
    searchQA: boolean
    project: boolean
    projectCollection: boolean
    inspiration: boolean
  }
}
