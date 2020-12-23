import { Command } from "../typings";

export const unavailable:Command = {
  run: () => "Hello",
  isAvailable: (ctx) => {
    if(ctx.player.currentNode.commands != undefined && ctx.player.currentNode.commands.includes('unavailable')) {
      return true
    }
    return false
  },
};