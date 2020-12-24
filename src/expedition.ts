import { Player } from './player';
import { Node, Runnable } from './typings';

export class Expedition {
  players: {[id: string]: Player};
  nodes: {[idx: string]: Node};
  setters: { [id: string]: Runnable } | undefined
  variables: {[id: string]: string | number | boolean};
  addPlayer: (id: string) => Expedition;

  constructor(
      nodes: {[idx: string]:Node}, 
      setters: { [id: string]: Runnable } | undefined,
      addPlayer?: (id: string) => Expedition
  ) {
    this.players = {};
    this.nodes = nodes;
    this.setters = setters
    this.variables = {}
    this.addPlayer = (addPlayer) ? addPlayer : (id) => {
      this.players[id] = new Player(id, 'start', this)
      return this
    }
  }

  get isComplete():boolean { return false }
}
