import expedition from './expedition';
import { cmdReturn, Player } from "./typings";
import { commands, isAvailable } from './commands/index';



function getPlayer(id: number): Player {
  return expedition.players[id]
}

function execute(cmd: string, args?: string) : cmdReturn {
  const ctx = {player: getPlayer(0), expedition}
  if (isAvailable(ctx,cmd)) {
    return {code:1, out:commands[cmd].run(ctx, args)}
  } else if (cmd == 'set' && args != undefined) {
    return expedition.set(args)
  }
  return {code: -1, err: "unknown command"}
}

function getState(): unknown {
  return {
    players: expedition.players,
    status: expedition.isComplete(),
  }
}

export { execute, getState }

