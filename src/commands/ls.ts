import { Command, Context } from "../typings";

export const ls:Command = {
  run: (ctx: Context) => {
    const currentNode = ctx.expedition.nodes[ctx.player.nodes[ctx.player.nodes.length-1]]
    if(currentNode.files != undefined) {
      let res = "Files :\n";
      for(const file in currentNode.files) {
        res += `${file}\n`
      }
      return res
    } else {
      return "No files"
    }
  },
  help: () => "Returns the arguments passed"
};