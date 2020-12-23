import { expedition, Player } from './expedition';
import { commands, isAvailable } from './commands/index';
import { appResponse, Context } from './typings';


function getPlayer(id: string): Player {
  return expedition.players[id]
}

function execute(ctx: Context, cmd: string) : appResponse {
  let output, errors
  if (ctx.player.input != undefined) {
    try { output = ctx.player.input(ctx, cmd) } 
    catch (error) { errors = error.message }
  } else {
    const args = cmd.split(/ +(.*)/)
    if (isAvailable(ctx,args[0])) {
      try { output = commands[args[0]].run(ctx, args[1]) } 
      catch (error) { errors = error.message }
    }
    else { errors = 'Invalid command' }
  }

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

