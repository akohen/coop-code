import { AsyncCommand } from "../typings";
import { toList } from "../utils";

export const stats:AsyncCommand = {
  run: async (ctx) => {
    const stats = await ctx.backend.stats()
    return `Current statistics:\n`+toList([
      ['Game version', process.env.npm_package_version],
      ['Total players', stats.players.toString()],
      ['Total expeditions', stats.expeditions.toString()],
    ],{pad:2})
  },
  help: () => "Get statistics about the game",
  isAvailable: (ctx) => (ctx.expedition.type == 'hq'),
};