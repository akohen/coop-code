import { Expedition } from "./expedition"
import { Node } from "./typings"

export class Player {
    name: string
    nodes: [string]
    expedition: Expedition
    input?: string
  
    constructor(name: string, start: string, expedition: Expedition) {
      this.name = name
      this.nodes = [start]
      this.expedition = expedition
    }
  
    get currentNode(): Node {
      if(!this.expedition.nodes.has(this.currentNodeName)) {
        throw new Error('Current node not found')
      }
      return this.expedition.nodes.get(this.currentNodeName) as Node
    }
  
    get currentNodeName(): string {
      return this.nodes[this.nodes.length-1]
    }
  
    get currentDepth(): number {
      return this.nodes.length
    }

    get prompt(): string {
      const cmd = this.expedition.commands.get(this.input as string)
      if (cmd) {
        if(cmd.help) return cmd.help()
        return '>'
      }
      return `${this.name}@${this.currentNodeName}>`
    }
  }