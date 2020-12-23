import { expedition, Player } from './expedition';
import { commands, isAvailable } from './commands/index';
import { appResponse, Context } from './typings';



function getPlayer(id: string): Player {
  return expedition.players[id]
}

function execute(ctx: Context, cmd: string, args?: string) : appResponse {
  let output, errors
  if (isAvailable(ctx,cmd)) {
    try { output = commands[cmd].run(ctx, args) } 
    catch (error) { errors = error.message }
  } else { errors = 'Invalid command' }
  
  return {
    errors,
    output,
    expedition: {state:getState(), path: getPlayer('foo').nodes}
  }
}

function getState(): unknown {
  return {
    player: getPlayer('foo').currentNode,
    status: expedition.isComplete,
  }
}

export { execute, getState }

