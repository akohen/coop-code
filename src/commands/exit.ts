import { Command, Context } from "../typings";

export const exit:Command = {
  run: (ctx: Context) => {
    if(ctx.player.nodes.length > 1) {
      ctx.player.nodes.pop()
      return ctx.player.currentNode.welcome(ctx)
    }
    throw new Error(`Cannot disconnect from this system`)
  },
  help: () => `Disconnect from a remote system`
};