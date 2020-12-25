import { Command, Context } from "../typings";

export const scan:Command = {
  run: (ctx: Context) => {
    const path = ctx.player.nodes
    const available = Array.from( ctx.expedition.nodes ).map(([nodeName, node]) => { 
      if(!path.includes(nodeName) && (!node.isAvailable || node.isAvailable(ctx)))
        return nodeName
    }).filter(e=>!!e).join('\n  ')
    return `Current connection path:\n  ${path.join(' => ')}\nAvailable nodes:\n  ${available}`
  },
  help: () => "Shows the available nodes"
};