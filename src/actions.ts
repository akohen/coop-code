import { expedition, Player } from './expedition';
import { commands, isAvailable } from './commands/index';
import { Context } from './typings';



function getPlayer(id: string): Player {
  return expedition.players[id]
}

function execute(ctx: Context, cmd: string, args?: string) : string | undefined{
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

