import { Command } from "../typings";

export const unavailable:Command = {
  run: () => "Hello",
  isAvailable: (ctx) => {
    if(ctx.player.currentNode.tags != undefined && ctx.player.currentNode.tags.includes('unavailable')) {
      return true
    }
    return false
  },
};