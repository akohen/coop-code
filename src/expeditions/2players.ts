import { Expedition } from "../expedition";
import { Player } from "../player";
import { Node } from "../typings";

const commonFiles = {architecture: "Hints go here"}
const startNode = (player: Player) => {
  return (player.expedition.players.size % 2) ? 'start1' : 'start2'
}

const nodes: {[idx: string]: Node} = {
  start1: {
    welcome:() => `Welcome to this two player expedition, you'll need another friend, to solve this one.
Use the expedition command to see how to invite someone to join you.`,
    tags: ['branch1'],
    files: commonFiles,
    isAvailable: () => false,
  },
  start2: {
    welcome:() => `Welcome to this two player expedition, you'll need to collaborate with your friend to solve it.`,
    tags: ['branch2'],
    files: commonFiles,
    isAvailable: () => false,
  },
};

function create(): Expedition {
  const exp = new Expedition('2-players', {nodes, startNode})
  return exp
}

function load(data: string): Expedition {
  return create().load(data)
}

export const exp = {create, load}