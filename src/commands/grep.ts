import { Command } from "../typings";
import { em, parseCommand } from "../utils";

export const grep:Command = {
  run: (ctx, args) => {
    if(!args) return grep.help?.(true)
    const command = parseCommand(args)
    return command.rest?.split('\n').filter(e => e.includes(command.cmd||'')).join('\n')
  },
  help: (long) => long ? 
  `grep command usage:
  grep PATTERN [LINES]     will return the lines that match PATTERN
  eg. ${em('read file | grep foo')} will return all the lines in ${em('file')} containing the string ${em('foo')}` : 
  "Print lines that match the pattern"
};