import { ExpeditionModule, Node } from "../../typings"
import { lockWelcome, lockCmd } from "../functions/generic-lock";

const chksum = (name: string, node?:Node):ExpeditionModule => ({
  nodes:[[name,{...node,
    welcome: lockWelcome({
      name,
      welcome:'welcome',
      locked:'locked'
    }),
  }]],
  commands: new Map([['_unlock-'+name, lockCmd({
    name,
    unlock:'unlock',
    locked:'locked',
    secret: Array.from(name).reduce((a,c) => a+c.charCodeAt(0),0).toString(),
    prompt:'>'
  })]])
})

export { chksum }