import { Command, Context } from "../typings";

export const read:Command = {
  run: (ctx: Context, args) => {
    const currentNode = ctx.player.currentNode
    if(currentNode.files != undefined && args != undefined && currentNode.files[args] != undefined) {
      const file = currentNode.files[args]
      return (typeof file == 'string') ? file : file(ctx)
    }
    throw new Error(`File ${args} not found`)
  },
  help: () => "Reads the content of a file"
};