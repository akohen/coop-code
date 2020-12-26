import { Expedition } from "./expedition";
import { Node } from "./typings";

const nodes: {[idx: string]: Node} = {
  hq: {
    welcome:() => "Welcome to the HQ",
  },
};
const hq = new Expedition(nodes)
hq.commands.set('expedition',{run: (ctx, args) => {
  if (args == undefined) {
    return
  }
  if (args == 'create') {
    // expedition creation
  } else if (args.startsWith('join ')) {
    // expedition join
  }
  return undefined
}})

export { hq }