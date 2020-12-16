import { expedition, Player } from './expedition';
import { cmdReturn } from "./typings";
import { commands, isAvailable } from './commands/index';



function getPlayer(id: string): Player {
  return expedition.players[id]
}

function execute(cmd: string, args?: string) : cmdReturn {
  const ctx = {player: getPlayer('foo'), expedition}
  if (isAvailable(ctx,cmd)) {
    return {code:1, out:commands[cmd].run(ctx, args)}
  }
  return {code: -1, err: "unknown command"}
}

function getState(): unknown {
  return {
    player: getPlayer('foo').currentNode,
    status: expedition.isComplete,
  }
}

export { execute, getState }

