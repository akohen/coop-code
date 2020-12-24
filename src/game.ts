import { execute } from "./actions";
import { Expedition } from './expedition';
import { appResponse, Context, Node } from "./typings";

const nodes: {[idx: string]:Node} = {
  start: {
    welcome:() => "Welcome to this tutorial.",
    commands:[],
    connected:["eng"],
    files: {foo:"bar", file2:`file2
multi-line content`},
  },
  eng: {welcome:() => ""},
  doc: {welcome:() => `Testing a multi-line welcome text.
This is the second line.

Last line`},
  locked: {
    welcome: (ctx) => {
      if(!ctx.expedition.variables['unlocked']) {
        ctx.player.input = (ctx, args) => {
          delete ctx.player.input
          if(args == '42') {
            ctx.player.nodes.push('locked')
            ctx.expedition.variables['unlocked'] = true
            return 'Unlocking'
          }
          throw new Error('locked')
        }
        throw new Error('locked')
      }
      return "Unlocked"
    },
    commands: ['unavailable']
  }
};

const setters = {
  foo: (ctx: Context, arg?: string) => {
    ctx.expedition.variables['foo'] = Number(arg)
    console.log(ctx.expedition.variables)
    return ''
  }
};


const expedition = new Expedition(nodes, setters).addPlayer('bob').addPlayer('foo')

export default (data: {[idx:string]:unknown}) : appResponse => {
  if(data['cmd'] != undefined && typeof data['cmd'] == "string") {
    try { // TODO: distinguish game error output from API errors (data:errors vs errors)
      const ctx = {player: expedition.players['foo'], expedition}
      return execute(ctx, data['cmd'])
    } catch (error) {
      return {
        errors: error.message
      }
    }
    
  } else return {
    errors: "no command provided"
  }
};
