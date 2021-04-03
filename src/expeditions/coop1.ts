import { Expedition } from "../expedition";
import { ExpeditionFactory } from "../expedition-factory";
import { Node } from "../typings";
import { remindTime } from "./functions/auto_commands";
import { chat } from "./modules/chat";
import { debug_mode } from "./modules/debug";
import { autoHints } from "./modules/hint";


export const coop1 = new ExpeditionFactory({type:'coop1', players:2, difficulty:'very easy', 
isAvailable: (ctx) => ctx.player.tags.includes('admin'),
create:(variables) => {
  // Expedition variables
  const [start1, start2] = ['start1', 'start2']
  // Base nodes layout
  const nodes: [string,Node][] = [
    [start1, {
      welcome:() => `Welcome to this expedition.`,
    }],
    [start2, {
      welcome:() => `Welcome to this expedition.`,
    }],
    ['documentation', {}],
    ['logs', {}],
  ];

  const endDate = new Date()
  endDate.setMinutes(endDate.getMinutes() + 60)
  const exp = new Expedition({
      nodes,
      endDate,
      variables,
      startNode: (player) => (player.expedition.players.length % 2) ? start1 : start2
  })
  exp
    .addModule(autoHints([]))
    .addModule(chat)
    .addModule(debug_mode('swordfish', {
      welcome:(ctx) => `Expedition variables and secrets:
      Expedition seed: ${ctx.expedition.variables.get('_seed')}`,
    }))
  .commands
    .set('_auto_remindtime', remindTime)
  return exp
}})