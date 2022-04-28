export const delHtmlTag = (text: string): string => {
  return text.replace(/<(?!img).*?>/g, '')
}
