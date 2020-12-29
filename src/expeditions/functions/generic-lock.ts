import { Command, Context, Runnable } from "../../typings";

export const lockWelcome = (
    {name, welcome, locked}:
    {name: string, welcome:string, locked:string}
  ):Runnable => (ctx: Context): string => {
    if(ctx.expedition.variables.get('_unlock-'+name)) return welcome
    ctx.player.input = '_unlock-' + name
    throw new Error(locked)
}

export const lockCmd = (
    {name, secret, unlock, locked, prompt}:
    {name: string, secret:string, unlock:string, locked:string, prompt:string}
  ):Command => ({
    run:(ctx: Context, args): string => {
      if(args != secret) throw new Error(locked)
      ctx.player.nodes.push(name)
      ctx.expedition.variables.set('_unlock-'+name, true)
      return unlock
    },
    help: () => (prompt),
    isAvailable: () => false,
})