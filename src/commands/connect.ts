import { Command, Context } from "../typings";

export const connect:Command = {
  run: (ctx: Context, args) => {
    if(args != undefined && ctx.expedition.nodes[args] != undefined) {
      ctx.player.nodes.push(args)
      return ctx.expedition.nodes[args].welcome
    }
    return `Could not resolve hostname ${args}`
  },
  help: () => `Open a connection to another system`
};