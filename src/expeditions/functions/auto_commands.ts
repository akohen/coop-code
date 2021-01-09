import { timeFormat } from "../../utils"
import { Command } from "../../typings";

export const remindTime:Command = { 
  run:(ctx) => {
    if(ctx.expedition.secondsLeft && ctx.expedition.secondsLeft < 600 && !ctx.expedition.variables.has('_10minleft_'+ctx.player.name)) {
      ctx.expedition.variables.set('_10minleft_'+ctx.player.name, true)
      return `Only ${timeFormat(ctx.expedition.secondsLeft)} left!`
    }
  },
  isAvailable: () => false,
}