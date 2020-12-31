import { Command, Context } from "../typings";
import { toList, timeLeft } from "../utils";

export const expedition:Command = {
  run: (ctx: Context) => {
    if(ctx.expedition.type == 'hq') return 'At HQ'
    return toList([
      ['Expedition ID', `${ctx.expedition.id} - Other players can join with 'expedition join ${ctx.expedition.id}'`],
      ['Players', Array.from(ctx.expedition.players.values()).map(p => p.name).join(' ')],
      ['Time Left', ctx.expedition.endDate ? timeLeft(ctx.expedition.endDate) : 'Unlimited'],
      ['Status', ctx.expedition.status],
    ], {emphasize:true})
  },
  help: () => "Information about the current expedition"
};