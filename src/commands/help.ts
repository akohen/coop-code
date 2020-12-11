import { Command } from "../typings";
import { available } from "./index";

export const help:Command = {
  run: (ctx, args) => {
    if(args == undefined || args?.length == 0) {
      let result = 'Available commands:';
      for(const cmd in available(ctx)) {
        result += `\n${cmd} ${available(ctx)[cmd].help?.(false) || ''}`
      }
      return result
    }

    if(!available(ctx)[args]) {
      return `The command ${args} is not recognized`
    }

    if(available(ctx)[args].help == undefined) {
      return `The command ${args} has no help page`
    }

    return available(ctx)[args].help?.(true)
    
  },
  help: (long) => (long ? 'long':'short')
};