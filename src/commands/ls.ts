import { Command, Context } from "../typings";

export const ls:Command = {
  run: (ctx: Context) => {
    const currentNode = ctx.player.currentNode
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
  help: () => "Lists the available files"
};