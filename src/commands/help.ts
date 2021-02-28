import { Command } from "../typings";
import { available } from "../actions";
import { toList } from "../utils";

export const help:Command = {
  run: (ctx, args) => {
    if(args == undefined || args?.length == 0) {
      const cmds = []
      for(const [cmdName, cmd] of available(ctx)) {
        cmds.push([cmdName, cmd.help?.(false)])
      }
      return 'Available commands:\n'+toList(cmds, {emphasize:true, pad:2})
    }

    const cmd = available(ctx).get(args)
    if(cmd == undefined) return `The command ${args} is not recognized`
    if(cmd.help == undefined) return `The command ${args} has no help page`
    return cmd.help(true)
    
  },
  help: () => `Display a command's help page`
};