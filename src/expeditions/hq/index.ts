import { Expedition } from "../../expedition";
import { Node } from "../../typings";
import { em } from "../../utils";
import { expedition } from "./expedition";
import { news } from "./news";

const nodes: [string,Node][] = [
  ['HQ', {
    welcome:() => "Welcome to the HQ",
    files: {
      tutorial: `If you need help, you can run the tutorial by running ${em('expedition create tutorial')}`,
      ...news,
    },
  }],
]
const hq = new Expedition({nodes, type:'hq'})

hq.commands.set('expedition', expedition)

export { hq }