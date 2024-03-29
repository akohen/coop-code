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

function getAvailable(ctx: Context, cmdName?: string): Command | AsyncCommand | undefined {
  if(!cmdName) return undefined
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

async function execute(ctx: Context, cmdString: string, background = false) : Promise<appResponse> {
  let output:string | undefined, errors
  if(ctx.player.expedition.inProgress) { // command is ignored in completed expeditions
    if (ctx.player.input != undefined && !background) {
      try {
        const cmd = ctx.expedition.commands.get(ctx.player.input)
        delete ctx.player.input
        output = await cmd?.run(ctx, cmdString)
      }
      catch (error) { errors = error.message }
    } else if (cmdString !== '' && !background) {
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
    autocomplete: getAutocomplete(ctx),
  }
}

function getAutocomplete(ctx: Context): string[] {
  return [
      'create', 'join', 'history',
      ...Array.from(available(ctx).keys()),
      ...Array.from( ctx.expedition.nodes ).map(([nodeName, node]) => { 
        if(!node.isAvailable || node.isAvailable(ctx))
          return nodeName
      }).filter(e=>!!e),
      ...(ctx.player.currentNode.files ? Object.keys(ctx.player.currentNode.files) : []),
    ] as string[]
}

export { execute, available, getAvailable }
