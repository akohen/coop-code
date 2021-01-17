import { alphanum, alpha } from "../data"

export const caesar = (str:string, shift=1):string => {
  return [...str.toLowerCase()]
    .map(c => alpha.includes(c) ? alpha[(alpha.length + shift + alpha.indexOf(c))%alpha.length]: c)
    .join('') 
}

export const permutation = (str:string, permutation:string[]):string => {
  return str.toLowerCase().split('').map(c => permutation[(c.charCodeAt(0)-97)%26]).join('')
}

export const asciiSum = (name: string): string => [...name].reduce((a,c) => a+c.charCodeAt(0),0).toString()
/** Returns the sum of the characters %26
 * Intended to be used with [a-z] only
 */
export const basicChecksum = (name: string): string => 
  String.fromCharCode([...name.toLowerCase()].reduce((a,c) => (a+c.charCodeAt(0)-97)%26,0)+97)

export const alphanumChecksum = (name: string): string => 
  alphanum[[...name].reduce((a,c) => alphanum.includes(c) ? (a+alphanum.indexOf(c))%alphanum.length : a,0)]

export const hexChecksum = (name: string): string => 
  [...name]
    .reduce((a,c) => alphanum.includes(c) ? (a+alphanum.indexOf(c))%256 : a,0)
    .toString(16)
    .padStart(2,'0')