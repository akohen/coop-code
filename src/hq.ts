import { history } from "./commands/expedition_history";
import { Expedition } from "./expedition";
import { expeditionFactories } from "./expeditions";
import { AsyncCommand, Node } from "./typings";
import { toList, toTable } from "./utils";

const nodes: {[idx: string]: Node} = {
  HQ: {
    welcome:() => "Welcome to the HQ",
  },
};
const hq = new Expedition('hq', {nodes})

const cmd: AsyncCommand = {
  run: async (ctx, args) => {
    if (args == undefined) {
      return cmd.help?.(true)
    }
    const argv = args.split(' ').filter(e => e)

    if (argv[0] == 'create') {
      if(argv[1]) {
        const factory = expeditionFactories.get(argv[1])
        if(!factory) throw new Error(`Unable to create expedition ${argv[1]}`)
        const expedition = await ctx.backend.createExpedition(factory.create())
        expedition.addPlayer(ctx.player)
        return ctx.player.currentNode.welcome?.(ctx)
      }
      return toTable(
        ['type', 'difficulty', 'players'],
        Array.from(expeditionFactories.entries()).map(([t,e]) => ([t,e.difficulty, e.players?.toString()]))
      )

    } else if (argv[0] == 'join') {
      if(argv[1]) {
        const expedition = await ctx.backend.getExpedition(argv[1])
        if(!expedition) throw new Error(`Expedition ${argv[1]} not found`)
        expedition.addPlayer(ctx.player)
        return ctx.player.currentNode.welcome?.(ctx)
      }
      const expeditions = await ctx.backend.listExpeditions()
      if(expeditions.length == 0) return "No expeditions to join, you need to create one with expedition create"
      return toTable(['id', 'type', 'players'], expeditions.map(e => [e.shortID, e.type, (e.players.length).toString()]))
    } else if(argv[0] == 'history') {
      return history(ctx, argv[1])
    }

    return cmd.help?.(true)
  },
  help: (long) => long ? 'expedition command usage:\n' + toList([
    ['expedition create','List expeditions available for creation'],
    ['expedition create [type]','Create a new expedition of the selected type'],
    ['expedition join','list all joinable expeditions (in progress, public, with room for new players)'],
    ['expedition join [id]', 'Join the specified expedition'],
    ['expedition history', 'See your past expeditions'],
  ],{pad:2}) : 'Create and join expeditions'}
hq.commands.set('expedition', cmd)

export { hq }