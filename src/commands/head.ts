import { Command } from "../typings";
import { em } from "../utils";

export const head:Command = {
  run: (ctx, args) => {
    if(!args) return undefined
    const lines = args.split('\n')
    const firstLine = lines[0].split(' ')
    let end = 1
    if(firstLine.length > 1 && /^\d{1,2}$/.exec(firstLine[0])) {
      end = parseInt(firstLine[0])
      lines[0] = lines[0].substring(lines[0].indexOf(' ')+1)
    }
    return lines.slice(0, end).join('\n')
  },
  help: (long) => long ? 
    `head command usage:
    head [N] DATA    will return the first N lines of the data, N defaults to 1 if omitted
  examples: 
    ${em('read file | head 5')} will return the first 5 lines of the file
    ${em('read file | head')} will return the first line of the file
    Can be used with ${em('tail')} to return a specific line, or group of lines. eg ${em('read file | head 5 | tail 2')} will return the 4th and 5th lines` : 
    'Returns the first lines of its arguments'
};