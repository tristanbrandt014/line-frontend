export const elipsify = (words: string, maxLength: number) =>
  words.length > maxLength ? words.slice(0, maxLength) + '...' : words;
