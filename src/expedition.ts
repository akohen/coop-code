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
    {type, nodes, setters, startNode, endCondition, endDate, variables} : {
      type?: string,
      nodes?: [string, Node][], 
      setters?: { [id: string]: Runnable },
      startNode?: (player: Player) => string,
      endCondition?: string,
      endDate?: Date,
      variables?: Map<string,string | number | boolean>,
    } = {}
  ) {
    this.type = (type) ? type : ''
    this.players = [];
    this.nodes = new Map(nodes)
    this.setters = setters ? new Map(Object.entries(setters)) : new Map()
    this.variables = variables ? variables : new Map()
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
      if(cmd[0].startsWith('_auto_')) yield cmd[1]
    }
  }
}
