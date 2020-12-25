import { Expedition } from "../expedition";
import { Context, Node } from "../typings";
import { doc } from "./nodes/doc";
import { locked } from "./nodes/locked";

const nodes: {[idx: string]: Node} = {
  start: {
    welcome:() => "Welcome to this tutorial.",
    commands:[],
    connected:["eng"],
    files: {foo:"bar", file2:`file2\nmulti-line content`},
  },
};

export function create(): Expedition {
  const exp = new Expedition(
    nodes,{
      foo: (ctx: Context, arg?: string) => {
        ctx.expedition.variables.set('foo', Number(arg))
        console.log(ctx.expedition.variables)
        return ''
      }
    })
    exp.nodes
    .set('doc2', doc('Welcome',{'name': 'content'}))
    .set('doc3', doc('Welcome',{'name': 'content'}))
    .set(...locked('locked2', 'welcome', 'prompt', 'secret','locked'))
  return exp
}

export function load(data: string): Expedition {
  return create()
}