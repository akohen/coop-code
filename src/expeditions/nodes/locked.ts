import { Node } from "../../typings";

const locked = (name: string, welcome: string, secret: string, locked: string): [string, Node] => {
    return [name, {
        welcome: (ctx) => {
          if(!ctx.expedition.variables[name+'-unlocked']) {
            ctx.player.input = (ctx, args) => {
              delete ctx.player.input
              if(args == secret) {
                ctx.player.nodes.push(name)
                ctx.expedition.variables[name+'-unlocked'] = true
                return welcome
              }
              throw new Error(locked)
            }
            throw new Error(locked)
          }
          return welcome
        }
      }]
}

export { locked }