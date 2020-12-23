import { Command, Context } from "../typings";
import stringArgv from "string-argv";

export const set:Command = {
  run: (ctx: Context, raw_args) => {
    if(raw_args == undefined) throw new Error(`Incorrect number of arguments`)
    const args = stringArgv(raw_args)
    if(args.length != 2) throw new Error(`Incorrect number of arguments`)
    if(ctx.expedition.setters == undefined || ctx.expedition.setters[args[0]] == undefined ) 
      throw new Error(`unable to set ${args[0]}`)

    return ctx.expedition.setters[args[0]](ctx, args[1])
  },
  help: () => `Set a variable to a new value`
};