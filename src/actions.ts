import { expedition, Player } from './expedition';
import { commands, isAvailable } from './commands/index';



function getPlayer(id: string): Player {
  return expedition.players[id]
}

function execute(cmd: string, args?: string) : string | undefined{
  const ctx = {player: getPlayer('foo'), expedition}
  if (isAvailable(ctx,cmd)) {
    return commands[cmd].run(ctx, args)
  }
  throw new Error('Invalid command')
}

function getState(): unknown {
  return {
    player: getPlayer('foo').currentNode,
    status: expedition.isComplete,
  }
}

export { execute, getState }

