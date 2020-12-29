import { Expedition } from "../expedition";
import { Context, Node } from "../typings";
import { doc } from "./nodes/doc";
import { locked } from "./nodes/locked";

const nodes: {[idx: string]: Node} = {
  start: {
    welcome:() => "Welcome to this real expedition.",
    files: {foo:"bar", file2:`file2\nmulti-line content`},
  },
};

function create(): Expedition {
  const exp = new Expedition('exp1',{
    nodes, setters: {
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
    exp.addModule(locked('locked2', {welcome:'welcome', prompt:'prompt>', secret:'secret',locked:'locked'}))
  return exp
}

function load(data: string): Expedition {
  return create().load(data)
}

export const exp1 = {create, load}