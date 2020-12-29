export function toTable(headers: string[], content: string[][]): string {
  const padSize = [...headers, ...content.flat()].filter(e => e).reduce((a:string, b:string) => (a.length > b.length ? a : b)).length + 2
  return headers.map(e => (e||'').toUpperCase().padEnd(padSize)).join('') + '\n' + 
          content.map(e => e.map(e => (e||'').padEnd(padSize)).join('')).join('\n')
}

export function toList(items: string[][], {pad = 0, emphasize = false}:{pad?:number, emphasize?:boolean} = {}): string {
  const padSize = items.map(i => (i[0]||'')).reduce((a:string, b:string) => (a.length > b.length ? a : b)).length + (emphasize ? 13 : 2)
  return items.map(i => ' '.repeat(pad) + ((emphasize ? em(i[0]) : i[0])||'').padEnd(padSize) + i.slice(1).join(' ')).join('\n')
}

export function em(str: string): string { return `[[;white;]${str}]`}