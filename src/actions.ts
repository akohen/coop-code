import { commands } from './commands/index';
import { appResponse, AsyncCommand, Command, Context } from './typings';
import { parseCommand, append } from './utils';

function getArgs(str1?:string, str2?:string): string | undefined {
  if(!str1) return str2
  if(!str2) return str1
  return str1 + ' ' + str2
}

function isAvailable(ctx: Context, cmd: Command|AsyncCommand, cmdName: string): boolean {
  return !cmdName.startsWith('_') && (!cmd.isAvailable || cmd.isAvailable?.(ctx))
}

function getAvailable(ctx: Context, cmdName: string): Command | AsyncCommand | undefined {
  let cmd = ctx.expedition.commands.get(cmdName)
  if( cmd && isAvailable(ctx, cmd, cmdName) ) return cmd
  cmd = commands.get(cmdName)
  if( cmd && isAvailable(ctx, cmd, cmdName) ) return cmd
  return undefined
}

function available (ctx: Context): Map<string,Command> {
  const cmds = new Map();
  for(const [cmdName, cmd] of commands) {
    if(isAvailable(ctx, cmd, cmdName)) cmds.set(cmdName, cmd)
  }
  for(const [cmdName, cmd] of ctx.expedition.commands) {
    if(isAvailable(ctx, cmd, cmdName)) cmds.set(cmdName, cmd)
  }
  return cmds
}

async function execute(ctx: Context, cmdString: string) : Promise<appResponse> {
  let output:string | undefined, errors
  if(ctx.player.expedition.inProgress) { // command is ignored in completed expeditions
    if (ctx.player.input != undefined) {
      try {
        const cmd = ctx.expedition.commands.get(ctx.player.input)
        delete ctx.player.input
        output = await cmd?.run(ctx, cmdString)
      }
      catch (error) { errors = error.message }
    } else if (cmdString !== '') {
      for(const segment of cmdString.split('|')) {
        const command = parseCommand(segment.trimLeft())
        const cmd = getAvailable(ctx, command.cmd)
        if (cmd) {
          try { output = await cmd.run(ctx, getArgs(command.rest, output?.trim())) } 
          catch (error) { errors = error.message }
        }
        else { errors = 'Invalid command' }
      }
      
    }

    for(const cmd of ctx.expedition.autoCommands()) {
      try { output = append(output, await cmd.run(ctx)) } 
      catch (error) { errors = append(errors,error.message) }
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
