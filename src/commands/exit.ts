import { Command, Context } from "../typings";

export const exit:Command = {
  run: (ctx: Context) => {
    if(ctx.player.nodes.length > 1) {
      ctx.player.nodes.pop()
      return ctx.expedition.nodes[ctx.player.nodes[ctx.player.nodes.length-1]].welcome
    }
    return `Can not disconnect from this system`
  },
  help: () => `Disconnect from a remote system`
};