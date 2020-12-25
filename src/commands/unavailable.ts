import { Command } from "../typings";

export const unavailable:Command = {
  run: () => "Hello",
  isAvailable: (ctx) => (ctx.player.currentNode.tags != undefined && ctx.player.currentNode.tags.includes('unavailable')),
};