import { ExpeditionModule, Node, Runnable } from "../../typings";

/**
  * A node requiring a password on the first connection
  * @name Node name
  * @welcome Text to show on successful connection
  * @prompt Player prompt
  * @secret the string to unlock the node
  * @locked returned as error on connection attempt before unlock
  * @unlocked Showed once, on unlock. If missing, the welcome text will be shown instead
  * @fail returned as error on wrong guess. If missing the locked text will be shown instead
  */
const locked = (
  name: string,
  { welcome, prompt, secret, locked, unlock, fail } : {
    welcome: string | Runnable,
    prompt: string,
    secret: string,
    locked: string,
    unlock?: string,
    fail?: string
  },
  node?: Node
): ExpeditionModule => ({
  nodes: [[name, {...node,
    welcome: (ctx) => {
      if(ctx.expedition.variables.get('_unlock-'+name)) return (typeof welcome == 'string') ? welcome : welcome(ctx)
      ctx.expedition.variables.set('_access-'+name, true)
      ctx.player.input = '_unlock-'+name
      throw new Error(locked)
    },
  }]],
  commands: new Map([['_unlock-'+name,{
    run:(ctx, args) => {
      if(args != secret) throw new Error(fail ? fail : locked)
      if(ctx.player.currentNodeName != name) ctx.player.nodes.push(name)
      ctx.expedition.variables.set('_unlock-'+name, true)
      return unlock ? unlock : (typeof welcome == 'string') ? welcome : welcome(ctx)
    },
    help: () => (prompt),
    isAvailable: () => false
  }]])
})

export { locked }