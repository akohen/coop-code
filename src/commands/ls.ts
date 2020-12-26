import { Command, Context } from "../typings";

export const ls:Command = {
  run: (ctx: Context) => {
    const currentNode = ctx.player.currentNode
    if(currentNode.files != undefined) {
      return `Available files:\n  ${Object.keys(currentNode.files).join("\n  ")}`
    } else {
      return "No files"
    }
  },
  help: () => "Lists the available files"
};