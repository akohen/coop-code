import { ExpeditionModule, Node } from "../../typings";

/**
  * Adds a _debug node and a _debug_mode setter
  * @node Node The _debug node
  */
const debug_mode = (password = 'debug', node?: Node): ExpeditionModule => ({
  nodes: [[
    '_debug', 
    {
      isAvailable: (ctx) => !!ctx.expedition.variables.get('_debug_'+ctx.player.name),
      ...node,
    }
  ]],
  setters: new Map([['_debug_mode',
    (ctx, arg?) => {
      if(!arg || arg != password) return ''
      ctx.expedition.variables.set('_debug_'+ctx.player.name, !ctx.expedition.variables.get('_debug_'+ctx.player.name))
      return `_debug mode is ${ctx.expedition.variables.get('_debug_'+ctx.player.name)}`
    }
  ]]),
})

export { debug_mode }