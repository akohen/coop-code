import { Player } from './player';
import { Command, ExpeditionModule, Node, Runnable, ExpeditionStatus, AsyncCommand } from './typings';

export class Expedition {
  players: Array<string>;
  nodes: Map<string, Node>;
  setters: Map<string, Runnable>;
  variables: Map<string,string | number | boolean>;
  commands: Map<string, Command|AsyncCommand>
  startNode: (player: Player) => string
  id?: string
  type: string
  endCondition: string;
  endDate?: Date
  lastUpdated: Date

  constructor(
    type: string,
    {nodes, setters, startNode, endCondition, endDate} : {
      nodes?: {[idx: string]: Node}, 
      setters?: { [id: string]: Runnable },
      startNode?: (player: Player) => string,
      endCondition?: string,
      endDate?: Date
    } = {}
  ) {
    this.type = type
    this.players = [];
    this.nodes = nodes ? new Map(Object.entries(nodes)) : new Map()
    this.setters = setters ? new Map(Object.entries(setters)) : new Map()
    this.variables = new Map()
    this.startNode = (startNode) ? startNode : () => { return 'start'}
    this.commands = new Map()
    this.endCondition = endCondition ? endCondition : 'complete'
    this.endDate = endDate
    this.lastUpdated = new Date()
  }

  addPlayer(player: Player): Expedition {
    this.players.push(player.name)
    player.expedition = this
    player.nodes = [this.startNode(player)]
    return this
  }

  removePlayer(player: Player): Expedition {
    this.players = this.players.filter(p => p!= player.name)
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
    return JSON.stringify([...this.variables])
  }

  load(data: string): Expedition {
    const variables = JSON.parse(data)
    this.variables = new Map(variables)
    return this
  }

  exportNodes(): string {
    const exportNodes: [string, unknown][] = [...this.nodes].map(([nodeName, node]) => ([
      nodeName, 
      {
        ...node,
        welcome: node.welcome?.toString(),
        isAvailable: node.isAvailable ? node.isAvailable.toString() : undefined,
      }
    ]))
    
    return JSON.stringify(exportNodes)
  }

  importNodes(nodes: string): Expedition { // Why did I do this ?
    const imported:[string,Node][] = JSON.parse(nodes)
    
    const importedNodes: [string, Node][] = imported.map(([key, value]) => {
      const node = {...value, welcome: new Function("return "+ value.welcome?.toString())()} as Node
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
    if (this.secondsLeft && this.secondsLeft < 0) return ExpeditionStatus.Failed
    return ExpeditionStatus.InProgress
  }

  get inProgress(): boolean {
    return (this.status == ExpeditionStatus.InProgress)
  }

  get secondsLeft(): number | undefined {
    return this.endDate ? Math.floor((this.endDate.getTime() - new Date().getTime())/1000) : undefined 
  }

  get shortID(): string {
    return this.id ? this.id.substring(0,6) : ''
  }

  debriefScreen(): string {
    return 'Expedition completed !'
  }

  *autoCommands(): Generator<Command|AsyncCommand> {
    for(const cmd of this.commands.entries()) {
      if(cmd[0].startsWith('_auto_'))
      yield cmd[1]
    }
  }
}
