import { files, passwdGen, lastLogins } from "./files"
import { fakeWords, fakeWordsLong } from "./passwords"
import { userNames } from "./users";

export const alphanum = '0123456789abcdefghikljmnopqrstuvwxyz'
export const alpha = 'abcdefghijklmnopqrstuvwxyz'
export const hex = '0123456789abcdef'
export const genHex = (size:number):string => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')

export class SampleData<T> extends Array<T> {
  shuffled():SampleData<T> {
    const shuffled = new SampleData(...this)
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled
  }
  sample(len = 1):SampleData<T> { return new SampleData(...this.shuffled().slice(0,len)) }
  random():T { return this[Math.floor(Math.random()*this.length)] }
  static from<T>(arr: Iterable<T> | ArrayLike<T>, mapFn?: (v: T, k: number) => T):SampleData<T> { 
    return mapFn ? new SampleData(...Array.from(arr, mapFn)) : new SampleData(...Array.from(arr)) 
  }
  static createSet<T>(samples:number, data:SampleData<T>, ...rest:SampleData<T>[]): SampleData<T[]> {
    const a = [data, ...rest].map(d => d.sample(samples))
    return SampleData.from(a[0].map((_,i) => a.map(x => x[i])))
  }
}

export const data = {
  passwords: {fakeWords:new SampleData(...fakeWords), fakeWordsLong: new SampleData(...fakeWordsLong)},
  users: SampleData.from(userNames),
  files: {logs: SampleData.from(files.useless), passwdGen, lastLogins, documentation: files.documentation},
}