import { Command, Context } from "../typings";

export const exit:Command = {
  run: (ctx: Context, args) => {
    if(ctx.player.nodes.length > 1) {
      ctx.player.nodes.pop()
      return ctx.player.currentNode.welcome(ctx)
    }
    if(ctx.expedition.type != 'hq') {
      if(args != '-y') throw new Error(`This will leave the expedition. Use exit -y to leave`)
      ctx.player.returnToHQ()
      return ctx.player.currentNode.welcome(ctx)
    }
    throw new Error(`Cannot disconnect from this system`)
  },
  help: () => `Disconnect from a remote system`
};