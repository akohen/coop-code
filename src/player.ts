import { Expedition } from "./expedition"
import { Runnable, Node } from "./typings"

export class Player {
    name: string
    nodes: [string]
    expedition: Expedition
    input?: Runnable
  
    constructor(name: string, start: string, expedition: Expedition) {
      this.name = name
      this.nodes = [start]
      this.expedition = expedition
    }
  
    get currentNode(): Node {
      return this.expedition.nodes[this.currentNodeName]
    }
  
    get currentNodeName(): string {
      return this.nodes[this.nodes.length-1]
    }
  
    get currentDepth(): number {
      return this.nodes.length
    }
  }