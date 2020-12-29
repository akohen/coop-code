export function toTable(headers: string[], content: string[][]): string {
  const padSize = [...headers, ...content.flat()].filter(e => e).reduce((a:string, b:string) => (a.length > b.length ? a : b)).length + 2
  return headers.map(e => (e||'').toUpperCase().padEnd(padSize)).join('') + '\n' + 
          content.map(e => e.map(e => (e||'').padEnd(padSize)).join('')).join('\n')
}