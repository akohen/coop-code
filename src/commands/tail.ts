import { Command } from "../typings";
import { em } from "../utils";

export const tail:Command = {
  run: (ctx, args) => {
    if(!args) return undefined
    const lines = args.split('\n')
    const firstLine = lines[0].split(' ')
    let start = lines.length-1
    if(firstLine.length > 1 && /^\d{1,2}$/.exec(firstLine[0])) {
      start = lines.length-parseInt(firstLine[0])
      lines[0] = lines[0].substring(lines[0].indexOf(' ')+1)
    }
    return lines.slice(start).join('\n')
  },
  help: (long) => long ? 
    `tail command usage:
    tail [N] DATA    will return the last N lines of the data, N defaults to 1 if omitted
  examples: 
    ${em('read file | head 5')} will return the last 5 lines of the file
    ${em('read file | head')} will return the last line of the file
    Can be used with ${em('tail')} to return a specific line, or group of lines. eg ${em('read file | head 5 | tail 2')} will return the 4th and 5th lines` : 
    'Returns the last lines of its arguments'
};