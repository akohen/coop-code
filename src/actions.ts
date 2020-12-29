import { commands } from './commands/index';
import { appResponse, Command, Context } from './typings';

function isAvailable(ctx: Context, cmd: Command): boolean {
  return Boolean(!cmd.isAvailable || cmd.isAvailable?.(ctx))
}

function getAvailable(ctx: Context, cmdName: string): Command | undefined {
  let cmd = ctx.expedition.commands.get(cmdName)
  if( cmd && isAvailable(ctx, cmd) ) return cmd
  cmd = commands.get(cmdName)
  if( cmd && isAvailable(ctx, cmd) ) return cmd
  return undefined
}

function available (ctx: Context): Map<string,Command> {
  const cmds = new Map();
  for(const [cmdName, cmd] of commands) {
    if(isAvailable(ctx, cmd)) cmds.set(cmdName, cmd)
  }
  for(const [cmdName, cmd] of ctx.expedition.commands) {
    if(isAvailable(ctx, cmd)) cmds.set(cmdName, cmd)
  }
  return cmds
}

function execute(ctx: Context, cmdString: string) : appResponse {
  let output, errors
  if (ctx.player.input != undefined) {
    try {
      const cmd = ctx.expedition.commands.get(ctx.player.input)
      delete ctx.player.input
      output = cmd?.run(ctx, cmdString)
    }
    catch (error) { errors = error.message }
  } else if (cmdString !== '') {
    const args = cmdString.split(/ +(.*)/)
    const cmd = getAvailable(ctx, args[0])
    if (cmd) {
      try { output = cmd.run(ctx, args[1]) } 
      catch (error) { errors = error.message }
    }
    else { errors = 'Invalid command' }
  }

  if(ctx.player.expedition.isComplete) {
    output = output ? output + '\n' : ''
    output += 'Expedition completed !'
    ctx.player.returnToHQ()
  }
  
  ctx.backend.update(ctx)

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

export { execute, getState, available, getAvailable }

