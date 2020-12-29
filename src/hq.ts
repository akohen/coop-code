import { Expedition } from "./expedition";
import { expeditionFactories } from "./expeditions";
import { Command, Node } from "./typings";
import { toTable } from "./utils";

const nodes: {[idx: string]: Node} = {
  HQ: {
    welcome:() => "Welcome to the HQ",
  },
};
const hq = new Expedition('hq', nodes)

const cmd: Command = {
  run: (ctx, args) => {
  if (args == undefined) {
    return cmd.help?.(true)
  }
  const argv = args.split(' ').filter(e => e)
  if (argv[0] == 'create') {
    if(argv[1]) {
      const factory = expeditionFactories.get(argv[1])
      if(!factory) throw new Error(`Unable to create expedition ${argv[1]}`)
      const expedition = ctx.backend.createExpedition(factory.create())
      expedition.addPlayer(ctx.player)
      return ctx.player.currentNode.welcome(ctx)
    }
    return Array.from(expeditionFactories.keys()).join('\n')
  } else if (argv[0] == 'join') {
    if(argv[1]) {
      const expedition = ctx.backend.getExpedition(argv[1])
      if(!expedition) throw new Error(`Expedition ${argv[1]} not found`)
      expedition.addPlayer(ctx.player)
      return ctx.player.currentNode.welcome(ctx)
    }
    const expeditions = ctx.backend.listExpeditions()
    if(!expeditions) return "No expeditions to join, you need to create one with expedition create"
    return toTable(['id', 'type', 'players'], expeditions.map(e => [e.id as string, e.type, (e.players.size).toString()]))
  }
  return cmd.help?.(true)
}, help: (long) => long ? 'long help' : 'Create and join expeditions'}
hq.commands.set('expedition', cmd)

export { hq }