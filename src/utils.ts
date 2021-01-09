export function toTable(headers: string[], content: Array<Array<string|undefined>>): string {
  const allItems = [...headers, ...content.flat()].filter(e => e) as string[]
  const padSize = allItems.reduce((a, b) => (a.length > b.length ? a : b)).length + 2
  return headers.map(e => (e||'').toUpperCase().padEnd(padSize)).join('') + '\n' + 
          content.map(e => e.map(e => (e||'').padEnd(padSize)).join('')).join('\n')
}

export function toList(items: Array<Array<string|undefined>>, {pad = 0, emphasize = false}:{pad?:number, emphasize?:boolean} = {}): string {
  const padSize = items.map(i => (i[0]||'')).reduce((a:string, b:string) => (a.length > b.length ? a : b)).length + (emphasize ? 13 : 2)
  return items.map(i => ' '.repeat(pad) + ((emphasize ? em(i[0]||'') : i[0]||'')).padEnd(padSize) + i.slice(1).join(' ')).join('\n')
}

export function em(str: string): string { return `[[;white;]${str}]`}

export function timeFormat(duration: number): string {
  const [minutes, seconds] = [Math.floor(duration / 60), duration % 60]
  return (minutes > 0 ? minutes.toString().padStart(2,'0')+'m' : '') + seconds.toString().padStart(2,'0')+'s'
}

export function timeLeft(date: Date): string {
  const diff = date.getTime() - new Date().getTime()
  return timeFormat(Math.floor(diff/1000))
}

export function parseCommand(input: string): {cmd: string, rest?: string, lines: string[], argv: string[], input: string} {
  const index = input.indexOf(' ')
  const lines = input.split('\n')
  return { cmd: input.substring(0,index), rest: input.substring(index+1), lines, argv: lines[0].split(' '), input }
}