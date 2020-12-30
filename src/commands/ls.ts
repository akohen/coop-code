import { Command, Context } from "../typings";

export const ls:Command = {
  run: (ctx: Context) => {
    const currentNode = ctx.player.currentNode
    if(currentNode.files != undefined && Object.keys(currentNode.files).length > 0) {
      return `Available files:\n  ${Object.keys(currentNode.files).sort((a,b) => (a.localeCompare(b))).join("\n  ")}`
    } else {
      return "No files"
    }
  },
  help: () => "Lists the available files"
};