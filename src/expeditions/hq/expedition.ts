import { expeditionFactories } from ".."
import { AsyncCommand, AsyncRunnable } from "../../typings"
import { toList, toTable } from "../../utils"

const history: AsyncRunnable = async (ctx) => {
  const expeditions = await ctx.backend.listExpeditions(ctx.player.name)
  return 'Showing whole history\n'+toTable(
    ['Expedition', 'Date', 'Players', 'State'],
    expeditions.map(e => [e.type, e.lastUpdated.toUTCString().substring(5,22),e.players.join(' '), e.status])
  )
}

const create: AsyncRunnable = async (ctx, arg) => {
  if(arg) {
    const factory = expeditionFactories.get(arg)
    if(!factory) throw new Error(`Unable to create expedition ${arg}`)
    const expedition = await ctx.backend.createExpedition(factory.create())
    expedition.addPlayer(ctx.player)
    return ctx.player.currentNode.welcome?.(ctx)
  }
  return toTable(
    ['type', 'difficulty', 'players min'],
    Array.from(expeditionFactories.entries()).map(([t,e]) => ([t,e.difficulty, e.players?.toString()]))
  )
}

const join: AsyncRunnable = async (ctx, arg) => {
  if(arg) {
    const expedition = await ctx.backend.getExpedition(arg)
    if(!expedition) throw new Error(`Expedition ${arg} not found`)
    expedition.addPlayer(ctx.player)
    return ctx.player.currentNode.welcome?.(ctx)
  }
  const expeditions = await ctx.backend.listExpeditions()
  if(expeditions.length == 0) return "No expeditions to join, you need to create one with expedition create"
  return toTable(['id', 'type', 'players'], expeditions.map(e => [e.shortID, e.type, (e.players.length).toString()]))
}


export const expedition: AsyncCommand = {
  run: async (ctx, args) => {
    if (args == undefined) {
      return expedition.help?.(true)
    }
    const argv = args.split(' ').filter(e => e)

    if (argv[0] == 'create') {
      return create(ctx, argv[1])
    } else if (argv[0] == 'join') {
      return join(ctx, argv[1])
    } else if(argv[0] == 'history') {
      return history(ctx, argv[1])
    }

    return expedition.help?.(true)
  },


  help: (long) => long ? 'expedition command usage:\n' + toList([
    ['expedition create','List expeditions available for creation'],
    ['expedition create [type]','Create a new expedition of the selected type'],
    ['expedition join','list all joinable expeditions (in progress, public, with room for new players)'],
    ['expedition join [id]', 'Join the specified expedition'],
    ['expedition history', 'See your past expeditions'],
  ], {pad:2}) : 'Create and join expeditions'
}