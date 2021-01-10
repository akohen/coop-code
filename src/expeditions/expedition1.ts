import { Expedition } from "../expedition";
import { Context, Node } from "../typings";
import { remindTime } from "./functions/auto_commands";
import { doc } from "./nodes/doc";
import { locked } from "./nodes/locked";

const nodes: {[idx: string]: Node} = {
  start: {
    welcome:() => "Welcome to this real expedition.",
    files: {foo:"bar", file2:`file2\nmulti-line content`},
  },
};

function create(): Expedition {
  const endDate = new Date()
  endDate.setSeconds(endDate.getSeconds() + 10)
  const exp = new Expedition({
    nodes, endDate, setters: {
      foo: (ctx: Context, arg?: string) => {
        ctx.expedition.variables.set('foo', Number(arg))
        console.log(ctx.expedition.variables)
        return ''
      }
    }})
    exp.nodes
      .set('doc2', doc('Welcome',{'name': 'content'}))
      .set('doc3', doc('Welcome',{'name': 'content'}))
    exp.commands
      .set('expedition-specific',{run:(ctx, args) => (args)})
      .set('_auto_remind', remindTime)
    exp
      .addModule(locked('locked2', {welcome:'welcome', prompt:'prompt>', secret:'secret',locked:'locked'}))
  return exp
}

export const exp1 = {create}