import { Expedition } from "../expedition";
import { Context, Node } from "../typings";
import { em } from "../utils";
import { chksum } from "./nodes/checksum-lock";
import { doc } from "./nodes/doc";
import { locked } from "./nodes/locked";

const nodes: {[idx: string]: Node} = {
  start: {
    welcome:() => `Welcome to this tutorial!\nType ${em('read how-to')} to start!`,
    files: {'how-to':`In each expedition, you're trying to recover data from a ship before the timer runs out.
You can use different commands to navigate the ship's systems.
The command you've just used is ${em('read')} and allows you to open files by giving it the name of the file you want to open. 
It this case, you've opened the 'how-to' file.
To continue, you'll need to use the ${em('ls')} command to list the files on this system, then the ${em('read')} command to open it.`,
next:`Let's go to another system using the ${em('connect')} command.
The system we want to connect to is called 'doc'.
If you need additional information, you can use ${em('help connect')} to display this command help page.`},
  },
  nohello: {}
};

function create(): Expedition {
  const exp = new Expedition('tutorial',
    {nodes,setters: {
      foo: (ctx: Context, arg?: string) => {
        ctx.expedition.variables.set('foo', Number(arg))
        console.log(ctx.expedition.variables)
        return ''
      },
      complete: (ctx: Context, arg?: string) => {
        ctx.expedition.variables.set('complete', Boolean(arg))
        return 'Set complete to ' + Boolean(arg)
      },
    }})
    exp.nodes
      .set('doc', doc('Welcome',{'name': 'content'}))
      .set('doc3', doc('Welcome',{'name': 'content'}))
    exp.commands
      .set('expedition-specific',{run:(ctx, args) => (args)})
    const tutorialLock = chksum('foo',{files:{'name': 'content'}})
    exp.addModule(tutorialLock)
    exp.addModule(locked('locked2', {welcome:'welcome', prompt: 'prompt>', secret: 'secret', locked:'locked'}))
  return exp
}

function load(data: string): Expedition {
  return create().load(data)
}

export const tutorial = {create, load}