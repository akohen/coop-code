import { Expedition } from "../expedition";
import { ExpeditionFactory } from "../expedition-factory";
import { Node } from "../typings";
import { SampleData } from "./data";
import { remindTime } from "./functions/auto_commands";
import { chat } from "./modules/chat";
import { debug_mode } from "./modules/debug";

export const easy2 = new ExpeditionFactory({type:'easy2', players:1, difficulty:'easy', 
create:(variables) => {
  const sampleFile = SampleData.from({length: 100}, (_, i) => i + 50)
  
  console.log(sampleFile)
  
  // Base nodes layout
  const nodes: [string,Node][] = [
    ['access-point', {
      welcome:() => `Welcome to this expedition.\nYour goal is to restart this ship's main reactor before the battery runs out of power, in 1 hour`,
    }],
  ];

  const endDate = new Date()
  endDate.setMinutes(endDate.getMinutes() + 60)
  const exp = new Expedition({
      nodes,
      endDate,
      startNode: () => 'access-point',
      variables,
  })
  exp
    .addModule(chat)
    .addModule(debug_mode('swordfish', {
      welcome:(ctx) => `Expedition variables and secrets:
      Expedition seed: ${ctx.expedition.variables.get('_seed')}`,
    }))
  .commands
    .set('_auto_remindtime', remindTime)
  return exp
}})