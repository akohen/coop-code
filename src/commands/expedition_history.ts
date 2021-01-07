import { AsyncRunnable } from "../typings"
import { toTable } from "../utils"

export const history: AsyncRunnable = async (ctx) => {
  const expeditions = await ctx.backend.listExpeditions(ctx.player.name)
  return 'Showing whole history\n'+toTable(
    ['Expedition', 'Date', 'Players', 'State'],
    expeditions.map(e => [e.type, e.lastUpdated.toUTCString().substring(5,22),e.players.join(' '), e.status])
  )
}