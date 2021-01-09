import { commands } from './commands/index';
import { appResponse, AsyncCommand, Command, Context } from './typings';
import { parseCommand } from './utils';

function append(str?:string, toAppend?: string) {
  return str ? str + '\n' + toAppend : toAppend
}

function isAvailable(ctx: Context, cmd: Command|AsyncCommand): boolean {
  return Boolean(!cmd.isAvailable || cmd.isAvailable?.(ctx))
}

function getAvailable(ctx: Context, cmdName: string): Command | AsyncCommand | undefined {
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

async function execute(ctx: Context, cmdString: string) : Promise<appResponse> {
  let output, errors
  if(ctx.player.expedition.inProgress) { // command is ignored in completed expeditions
    if (ctx.player.input != undefined) {
      try {
        const cmd = ctx.expedition.commands.get(ctx.player.input)
        delete ctx.player.input
        output = await cmd?.run(ctx, cmdString)
      }
      catch (error) { errors = error.message }
    } else if (cmdString !== '') {
      const command = parseCommand(cmdString)
      const cmd = getAvailable(ctx, command.cmd)
      if (cmd) {
        try { output = await cmd.run(ctx, command.rest) } 
        catch (error) { errors = error.message }
      }
      else { errors = 'Invalid command' }
    }

    if(ctx.player.expedition.commands.has('_exec_')) {
      output = append(output, await ctx.player.expedition.commands.get('_exec_')?.run(ctx))
    }
  }

  if(!ctx.player.expedition.inProgress) {
    output = append(output, ctx.player.expedition.debriefScreen())
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
    status: ctx.expedition.status,
  }
}

export { execute, getState, available, getAvailable }
