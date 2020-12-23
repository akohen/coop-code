import { Command, Context } from "../typings";

export const connect:Command = {
  run: (ctx: Context, args) => {
    if(args != undefined && ctx.expedition.nodes[args] != undefined) {
      const targetNode = ctx.expedition.nodes[args]
      if(targetNode.isAvailable == undefined || targetNode.isAvailable(ctx)) {
        const welcome = ctx.expedition.nodes[args].welcome(ctx)
        if(ctx.player.nodes.includes(args)) {
          while(ctx.player.currentNodeName != args) {
            ctx.player.nodes.pop()
          }
        } else {
          ctx.player.nodes.push(args)
        }
        return welcome
      }
    }
    return `Could not resolve hostname ${args}`
  },
  help: () => `Open a connection to another system`
};