import { Command, Context } from "../typings";
import { toList } from "../utils";

export const expedition:Command = {
  run: (ctx: Context) => {
    if(ctx.expedition.type == 'hq') return 'At HQ'
    return toList([
      ['Expedition ID', `${ctx.expedition.id} - Other players can join with 'expedition join ${ctx.expedition.id}'`],
      ['Players', Array.from(ctx.expedition.players.values()).map(p => p.name).join(' ')],
      ['Time Left', '1 hour']
    ], {emphasize:true})
  },
  help: () => "Information about the current expedition"
};