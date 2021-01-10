export const ceasar = (str:string, shift=1):string => {
  return str.split('').map(c => String.fromCharCode(97+(c.charCodeAt(0)-97+shift)%26)).join('') 
}

export const permutation = (str:string, permutation:string[]):string => {
  return str.toLowerCase().split('').map(c => permutation[(c.charCodeAt(0)-97)%26]).join('')
}