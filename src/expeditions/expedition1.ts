import { Expedition } from "../expedition";
import { ExpeditionFactory } from "../expedition-factory";
import { Node } from "../typings";
import { remindTime } from "./functions/auto_commands";
import { chat } from "./modules/chat";
import { debug_mode } from "./modules/debug";
import { autoHints } from "./modules/hint";


export const template = new ExpeditionFactory({type:'template', players:1, difficulty:'unknown', 
create:(variables) => {
  // Base nodes layout
  const nodes: [string,Node][] = [
    ['start', {
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