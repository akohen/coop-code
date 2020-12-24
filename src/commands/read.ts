import { Command, Context } from "../typings";

export const read:Command = {
  run: (ctx: Context, args) => {
    const currentNode = ctx.player.currentNode
    if(currentNode.files != undefined && args != undefined) {
      return currentNode.files[args]
    }
    return "File not found"
  },
  help: () => "Reads the content of a file"
};