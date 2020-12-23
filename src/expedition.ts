import { Context, Node } from './typings';

class Player {
  name: string;
  nodes: [string];
  expedition: Expedition;

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

class Expedition {
  players: {[id: string]:Player};
  nodes: {[idx: string]:Node};
  setters: { [id: string]: (ctx: Context, args: string) => string; } | undefined
  variables: {[id: string]: string | number};

  constructor(
      nodes: {[idx: string]:Node}, 
      setters: { [id: string]: (ctx: Context, args: string) => string; } | undefined) 
  {
    this.players = {};
    this.nodes = nodes;
    this.setters = setters
    this.variables = {}
  }

  get isComplete():boolean { return false }
  addPlayer(name: string, start: string): Expedition {
    this.players[name] = new Player(name, start, this)
    return this
  }
}

const nodes: {[idx: string]:Node} = {
  start: {
    welcome:"Welcome to this tutorial.",
    commands:[],
    connected:["eng"],
    files: {foo:"bar", file2:`file2
multi-line content`},
  },
  eng: {welcome:""},
  doc: {welcome:`Testing a multi-line welcome text.
This is the second line.

Last line`},
  locked: {
    welcome: "",
    commands: ['unavailable']
  }
};

const setters = {
  foo: (ctx: Context, arg: string) => {
    ctx.expedition.variables['foo'] = Number(arg)
    console.log(ctx.expedition.variables)
    return ''
  }
};


const expedition = new Expedition(nodes, setters).addPlayer('bob', 'start').addPlayer('foo', 'start')

export { expedition, Player, Expedition };
