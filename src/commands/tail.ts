import { Command } from "../typings";

export const tail:Command = {
  run: (ctx, args) => args?.substring(args.lastIndexOf('\n')+1),
  help: () => "Returns the last line of its arguments"
};