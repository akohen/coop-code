import { cmdReturn, Node, Player } from './typings';


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
};

const players:[Player] = [{id:'Bob', name: 'Bob', nodes: ["doc"]}]
const isComplete = ():boolean => true
const set = (cmd: string): cmdReturn => {
  const args = cmd.split(" ")
  if (args[0] == "answer" && args[1] == '42') {
    return {code:1, out:"finished"}
  }
  return {code:1, out:"OK"}
}

const expedition = {nodes, players, isComplete, set}

export default expedition;
