import { Player } from './player';
import { Node, Runnable } from './typings';

export class Expedition {
  players: {[id: string]:Player};
  nodes: {[idx: string]:Node};
  setters: { [id: string]: Runnable } | undefined
  variables: {[id: string]: string | number | boolean};

  constructor(
      nodes: {[idx: string]:Node}, 
      setters: { [id: string]: Runnable } | undefined) 
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
