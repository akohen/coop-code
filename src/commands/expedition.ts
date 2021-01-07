import { Command, Context } from "../typings";
import { toList, timeFormat } from "../utils";

export const expedition:Command = {
  run: (ctx: Context) => {
    if(ctx.expedition.type == 'hq') return 'At HQ'
    return toList([
      ['Expedition ID', `${ctx.expedition.shortID} - Other players can join with 'expedition join ${ctx.expedition.shortID}'`],
      ['Players', ctx.expedition.players.join(' ')],
      ['Time Left', ctx.expedition.secondsLeft != undefined ? timeFormat(ctx.expedition.secondsLeft) : 'Unlimited'],
      ['Status', ctx.expedition.status],
    ], {emphasize:true})
  },
  help: () => "Information about the current expedition"
};