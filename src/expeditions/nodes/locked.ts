import { ExpeditionModule, Node } from "../../typings";

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
    welcome: string,
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
      if(ctx.expedition.variables.get(name+'-unlock')) return welcome
      ctx.player.input = name+'-unlock'
      throw new Error(locked)
    },
  }]],
  commands: new Map([[name+'-unlock',{
    run:(ctx, args) => {
      if(args != secret) throw new Error(fail ? fail : locked)
      ctx.player.nodes.push(name)
      ctx.expedition.variables.set(name+'-unlock', true)
      return unlock ? unlock : welcome
    },
    help: () => (prompt),
    isAvailable: () => false
  }]])
})

export { locked }