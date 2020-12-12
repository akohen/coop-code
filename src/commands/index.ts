import { Command, Context } from "../typings";
import { echo } from "./echo";
import { help } from "./help";
import { foo } from "./foo";
import { unavailable } from "./unavailable";
import { ls } from "./ls";
import { read } from "./read";

const commands:{[cmdName: string]: Command} = {echo, help, foo, unavailable, ls, read};

function isAvailable(ctx: Context, cmdName: string): boolean {
  return Boolean(!commands[cmdName].isAvailable || commands[cmdName].isAvailable?.(ctx))
}

function available (ctx: Context): {[cmdName: string]: Command} {
  const cmds: {[cmdName: string]: Command} = {};
  for(const cmd in commands) {
    if(isAvailable(ctx, cmd)) {
      cmds[cmd] = commands[cmd]
    }
  }
  return cmds
}

export { commands, available, isAvailable };