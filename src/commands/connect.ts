import { Command, Context, Node } from "../typings";

export const connect:Command = {
  run: (ctx: Context, args) => {
    if(args != undefined && ctx.expedition.nodes.get(args) != undefined) {
      const targetNode: Node = ctx.expedition.nodes.get(args) as Node
      if(targetNode.isAvailable == undefined || targetNode.isAvailable(ctx)) {
        const welcome = targetNode.welcome?.(ctx)
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
    throw new Error(`Could not resolve hostname ${args}`)
  },
  help: () => `Open a connection to another system`
};