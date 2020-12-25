import { Command } from "../typings";
import { available } from "../actions";

export const help:Command = {
  run: (ctx, args) => {
    if(args == undefined || args?.length == 0) {
      let result = 'Available commands:';
      for(const [cmdName, cmd] of available(ctx)) {
        result += `\n${cmdName} ${cmd.help?.(false) || ''}`
      }
      return result
    }

    const cmd = available(ctx).get(args)
    if(cmd == undefined) return `The command ${args} is not recognized`
    if(cmd.help == undefined) return `The command ${args} has no help page`
    return cmd.help(true)
    
  },
  help: (long) => (long ? 'long':'short')
};