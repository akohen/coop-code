import { commands, isAvailable } from './commands/index';
import { appResponse, Context } from './typings';


function execute(ctx: Context, cmd: string) : appResponse {
  let output, errors
  if (ctx.player.input != undefined) {
    try { output = ctx.player.input(ctx, cmd) } 
    catch (error) { errors = error.message }
  } else if (cmd !== '') {
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
    prompt: ctx.player.prompt,
    expedition: {state:getState(ctx), path: ctx.player.nodes}
  }
}

function getState(ctx: Context): unknown {
  return {
    player: ctx.player.currentNode,
    status: ctx.expedition.isComplete,
  }
}

export { execute, getState }

