import { Context, ExpeditionModule } from "../../typings";
import { hint } from "../../utils";

type Hint = [(ctx: Context) => boolean, string]

export const autoHints = (hints: Array<Hint>): ExpeditionModule => ({
  commands: new Map([
    ['_auto_hint', {
      run:(ctx:Context) => {
        for (let h = 0; h < hints.length; h++) {
          const [condition, msg] = hints[h]
          if(condition(ctx) && !ctx.expedition.variables.has('_hint_'+h)) {
            ctx.expedition.variables.set('_hint_'+h, true)
            for(const player of ctx.expedition.players) {
              const prev = ctx.expedition.variables.get('_chat_messages_'+player)
              if(prev) {
                ctx.expedition.variables.set('_chat_messages_'+player,prev+'\n'+ hint(msg))
              } else {
                ctx.expedition.variables.set('_chat_messages_'+player, hint(msg))
              }
            }
            return undefined
          }
        }
        return undefined
      },
    }],
  ])
})