import { Player } from './player';
import { Command, Context, ExpeditionModule, Node, Runnable } from './typings';

export class Expedition {
  players: {[id: string]: Player};
  nodes: Map<string, Node>;
  setters: Map<string, Runnable>;
  variables: Map<string,string | number | boolean>;
  commands: Map<string, Command>
  startNode: (ctx: Context) => string
  id?: string
  type: string

  constructor(
    type: string,
    nodes?: {[idx: string]: Node}, 
    setters?: { [id: string]: Runnable },
    startNode?: (ctx: Context) => string
  ) {
    this.type = type
    this.players = {};
    this.nodes = nodes ? new Map(Object.entries(nodes)) : new Map()
    this.setters = setters ? new Map(Object.entries(setters)) : new Map()
    this.variables = new Map()
    this.startNode = (startNode) ? startNode : () => { return 'start'}
    this.commands = new Map()
  }

  addPlayer(player: Player): Expedition {
    this.players[player.name] = player
    player.expedition = this
    player.nodes = ['start']
    return this
  }

  addModule({nodes, variables, commands}:ExpeditionModule): Expedition {
    for (const [name, node] of nodes || []) {
      this.nodes.set(name, node)
    }
    if (variables != undefined) {
      this.variables = new Map([...this.variables, ...variables])
    }
    if (commands != undefined) {
      this.commands = new Map([...this.commands, ...commands])
    }
    return this
  }

  export(): string {
    return JSON.stringify({'variables':[...this.variables]})
  }

  load(data: string): Expedition {
    const {variables} = JSON.parse(data)
    this.variables = new Map(variables)
    return this
  }

  exportNodes(): string {
    const exportNodes: [string, unknown][] = [...this.nodes].map(([nodeName, node]) => ([
      nodeName, 
      {
        ...node,
        welcome: node.welcome.toString(),
        isAvailable: node.isAvailable ? node.isAvailable.toString() : undefined,
      }
    ]))
    
    return JSON.stringify(exportNodes)
  }

  importNodes(nodes: string): Expedition { // Why did I do this ?
    const imported:[string,Node][] = JSON.parse(nodes)
    
    const importedNodes: [string, Node][] = imported.map(([key, value]) => {
      const node = {...value, welcome: new Function("return "+ value.welcome.toString())()} as Node
      return [ key, node ]
    })
    this.nodes = new Map(importedNodes)
    return this
  }

  get isComplete():boolean { return false }
}
