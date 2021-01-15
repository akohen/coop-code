import { alphanum } from "../data"

export const caesar = (str:string, shift=1):string => {
  return str.split('').map(c => String.fromCharCode(97+(c.charCodeAt(0)-97+shift)%26)).join('') 
}

export const permutation = (str:string, permutation:string[]):string => {
  return str.toLowerCase().split('').map(c => permutation[(c.charCodeAt(0)-97)%26]).join('')
}

export const asciiSum = (name: string): string => [...name].reduce((a,c) => a+c.charCodeAt(0),0).toString()
/** Returns the sum of the characters %26
 * Intended to be used with [a-z] only
 */
export const basicChecksum = (name: string): string => String.fromCharCode([...name.toLowerCase()].reduce((a,c) => (a+c.charCodeAt(0)-97)%26,0)+97)
export const alphanumChecksum = (name: string): string => alphanum[[...name].reduce((a,c) => (a+alphanum.indexOf(c))%alphanum.length,0)]
export const hexChecksum = (name: string): string => [...name].reduce((a,c) => (a+alphanum.indexOf(c))%256,0).toString(16).padStart(2,'0')