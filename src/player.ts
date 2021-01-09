import { Expedition } from "./expedition"
import { hq } from "./hq"
import { ExpeditionStatus, Node } from "./typings"

export class Player {
    name: string
    nodes!: [string]
    expedition!: Expedition
    input?: string
    prevExpedition?: Expedition
  
    constructor(name: string) {
      this.name = name
      this.returnToHQ()
    }
  
    returnToHQ(): void {
      if(this.expedition) this.prevExpedition = this.expedition
      if(this.expedition && this.expedition.status == ExpeditionStatus.InProgress) this.expedition.removePlayer(this)
      this.expedition = hq
      this.nodes = ['HQ']
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
      if(this.expedition && this.input) {
        const cmd = this.expedition.commands.get(this.input as string)
        if (cmd) {
          if(cmd.help) return cmd.help()
          return '>'
        }
      }
      return `${this.name}@${this.currentNodeName}>`
    }
  }