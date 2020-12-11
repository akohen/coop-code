import { Command } from "../typings";

export const echo:Command = {
  run: (ctx, args) => args,
  help: () => "Returns the arguments passed"
};