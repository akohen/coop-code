import { Expedition } from "../expedition";
import { Context, Node } from "../typings";
import { doc } from "./nodes/doc";
import { locked } from "./nodes/locked";

const nodes: {[idx: string]: Node} = {
  start: {
    welcome:() => "Welcome to this tutorial.",
    files: {foo:"bar", file2:`file2\nmulti-line content`},
  },
};

function create(): Expedition {
  const exp = new Expedition('tutorial',
    nodes,{
      foo: (ctx: Context, arg?: string) => {
        ctx.expedition.variables.set('foo', Number(arg))
        console.log(ctx.expedition.variables)
        return ''
      },
      complete: (ctx: Context, arg?: string) => {
        ctx.expedition.variables.set('complete', Boolean(arg))
        return 'Set complete to ' + Boolean(arg)
      },
    })
    exp.nodes
      .set('doc2', doc('Welcome',{'name': 'content'}))
      .set('doc3', doc('Welcome',{'name': 'content'}))
    exp.commands
      .set('expedition-specific',{run:(ctx, args) => (args)})
    exp.addModule(locked('locked2', 'welcome', 'prompt>', 'secret','locked'))
  return exp
}

function load(data: string): Expedition {
  return create().load(data)
}

export const test = {create, load}