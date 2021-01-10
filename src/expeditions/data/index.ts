import { files } from "./files"
import { fakeWords, fakeWordsLong } from "./passwords"

class SampleData<T> extends Array<T> {
  sample(len = 1) {
    const shuffled = [...this]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0,len)
  }

  random() { return this[Math.floor(Math.random()*this.length)] }
  static from<T>(arr: Iterable<T> | ArrayLike<T>) { return new SampleData(...Array.from(arr)) }
}

export const sampleData = {
  logs: SampleData.from(files.logs),
  passwords: {fakeWords:new SampleData(...fakeWords), fakeWordsLong: new SampleData(...fakeWordsLong)}
}