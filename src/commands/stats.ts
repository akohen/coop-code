import { Command } from "../typings";
import { toList } from "../utils";

export const stats:Command = {
  run: () => (`Current statistics:\n`+toList([
    ['Game version', process.env.npm_package_version],
  ],{pad:2})),
  help: () => "Get statistics about the game",
  isAvailable: (ctx) => (ctx.expedition.type == 'hq'),
};