export const ceasar = (str:string):string => {
  const shift = 1
  return str.split('').map(c => String.fromCharCode(97+(c.charCodeAt(0)-97+shift)%26)).join('') 
}