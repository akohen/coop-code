import { Player } from './player';
import { Command, ExpeditionModule, Node, Runnable, ExpeditionStatus } from './typings';

export class Expedition {
  players: Map<string, Player>;
  nodes: Map<string, Node>;
  setters: Map<string, Runnable>;
  variables: Map<string,string | number | boolean>;
  commands: Map<string, Command>
  startNode: (player: Player) => string
  id?: string
  type: string
  endCondition: string;

  constructor(
    type: string,
    {nodes, setters, startNode, endCondition} : {
      nodes?: {[idx: string]: Node}, 
      setters?: { [id: string]: Runnable },
      startNode?: (player: Player) => string,
      endCondition?: string
    } = {}
  ) {
    this.type = type
    this.players = new Map();
    this.nodes = nodes ? new Map(Object.entries(nodes)) : new Map()
    this.setters = setters ? new Map(Object.entries(setters)) : new Map()
    this.variables = new Map()
    this.startNode = (startNode) ? startNode : () => { return 'start'}
    this.commands = new Map()
    this.endCondition = endCondition ? endCondition : 'complete'
  }

  addPlayer(player: Player): Expedition {
    this.players.set(player.name, player)
    player.expedition = this
    player.nodes = [this.startNode(player)]
    return this
  }

  removePlayer(player: Player): Expedition {
    this.players.delete(player.name)
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

  get isComplete():boolean {
    return !!this.variables.get(this.endCondition)
  }

  get status(): ExpeditionStatus {
    if (this.isComplete) return ExpeditionStatus.Completed
    return ExpeditionStatus.InProgress
  }

  get inProgress(): boolean {
    return (this.status == ExpeditionStatus.InProgress)
  }
}
