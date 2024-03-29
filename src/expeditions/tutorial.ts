import { Expedition } from "../expedition";
import { ExpeditionFactory } from "../expedition-factory";
import { Context, Node, Runnable } from "../typings";
import { em } from "../utils";
import { useless } from "./data/files"
import { lockCmd, lockWelcome } from "./functions/generic-lock";

const lockedNodeWelcome = `Well done!
In some expeditions and/or systems, you can also set some variables using the command ${em('set')}.
To finish this expedition, you need to set the 'completed' variable to 'true' (other expeditions won't be this easy to complete!)
You can also keep exploring and trying commands.`

const nodes: {[idx: string]: Node} = {
  start: {
    welcome:() => `Welcome to this tutorial!\nType ${em('read how-to')} to start!`,
    files: {'how-to':`In each expedition, you're trying to recover data from a ship before the timer runs out.
You can use different commands to navigate the ship's systems.
The command you've just used is ${em('read')} and allows you to open files by giving it the name of the file you want to open. 
In this case, you've opened the 'how-to' file.
To continue, you'll need to use the ${em('ls')} command to list the files on this system, then the ${em('read')} command to open it.`,
next:`Let's go to another system using the ${em('connect')} command.
The system we want to connect to is called 'terminal-a6b1'.
If you need additional information, you can use ${em('help connect')} to display this command help page.`},
  },
  'terminal-a6b1': {
    welcome: () => `Let's see were you can go now, using the ${em('scan')} command.
This will show all the systems you are currently connected to, and which ones can be reached from your current loction`,
  },
  'hub-ff08': {
    welcome: () => `Some systems are only accessible from some specific systems. Only currently accessible systems are shown on scans`,
    tags: ['hub'],
    files: {
      ...useless[0], 
      'about-locks': `Some systems are locked, and require a password for access.\nSometimes this password can be found or guessed, sometimes you will need to do some calculations to find it.`, 
      'passwd': `admin:swordfish:1001:1016:System Administrator:/home   # Remember to activate password hashing !`},
  },
  'first-lock': {
    welcome: lockWelcome({
      name: 'first-lock',
      welcome: lockedNodeWelcome,
      locked:`This system is password-protected, please enter the admin password`,
    }),
    isAvailable: (ctx) => !!ctx.player.currentNode.tags?.includes('hub'),
  },
};


function create(variables: Map<string, string | number | boolean>): Expedition {
  const setters:[string,Runnable][] = [['completed', 
  (ctx: Context, arg?: string) => {
    ctx.expedition.variables.set('complete', (arg === 'true'))
    return `Set completed to ${em((arg === 'true').toString())}`
  }]]
  const endDate = new Date()
  endDate.setMinutes(endDate.getMinutes() + 60)
  const exp = new Expedition({
      nodes: Object.entries(nodes),
      setters,
      endDate,
      variables
  })
    exp.commands.set('_unlock-first-lock',lockCmd({
      name:'first-lock',
      unlock: `Password correct\n${lockedNodeWelcome}`,
      locked:'Incorrect password',
      secret: 'swordfish',
      prompt:'Password>'
    }))
  return exp
}

export const tutorial = new ExpeditionFactory({type:'tutorial', create, players:1, difficulty:'trivial'})