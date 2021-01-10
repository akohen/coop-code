import { Expedition } from "../expedition";
import { Player } from "../player";
import { Node } from "../typings";
import { chat } from "./modules/chat";
import { locked } from "./nodes/locked";

const commonFiles = {architecture: "Hints go here"}
const startNode = (player: Player) => {
  return (player.expedition.players.length % 2) ? 'start1' : 'start2'
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
  const exp = new Expedition({nodes, startNode, endCondition:'locked1-unlock'})
  exp
    .addModule(locked('locked1', 
      {welcome:'welcome', prompt:'Enter your access code>', secret:'secret', locked:'locked', unlock:'unlock', fail:'fail'},
      {welcome: () => '', isAvailable: (ctx) => (ctx.player.currentNode.tags?.includes('branch1')||false)},
      ))
    .addModule(locked('locked2', 
      {welcome:'welcome', prompt:'Enter your access code>', secret:'secret', locked:'locked', unlock:'unlock', fail:'fail'},
      {welcome: () => '', isAvailable: (ctx) => (ctx.player.currentNode.tags?.includes('branch2')||false)},
      ))
    .addModule(chat)
  return exp
}

export const exp = {create, players:2}