import { Node } from "../../typings";

const locked = (
  name: string,
  welcome: string,
  prompt: string,
  secret: string,
  locked: string
): [string, Node] => {
  return [name, {
    welcome: (ctx) => {
      if(ctx.expedition.variables.get(name+'-unlocked')) return welcome
      ctx.player.inputPrompt = prompt
      ctx.player.input = (ctx, args) => {
        delete ctx.player.input
        delete ctx.player.inputPrompt
        if(args != secret) throw new Error(locked)
        ctx.player.nodes.push(name)
        ctx.expedition.variables.set(name+'-unlocked', true)
        return welcome
      }
      throw new Error(locked)
    }
  }]
}

export { locked }