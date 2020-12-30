import { ExpeditionModule, Node } from "../../typings"
import { lockWelcome, lockCmd } from "../functions/generic-lock";

const chksumSolve = (name: string): string => (Array.from(name).reduce((a,c) => a+c.charCodeAt(0),0).toString())

const chksum = (name: string, welcome: string, node?:Node):ExpeditionModule => ({
  nodes:[[name,{...node,
    welcome: lockWelcome({
      name,
      welcome,
      locked:`Please verify your request by validating this node's ASCII checksum`
    }),
  }]],
  commands: new Map([['_unlock-'+name, lockCmd({
    name,
    unlock: `Checksum correct\n${welcome}`,
    locked:'Incorrect checksum',
    secret: chksumSolve(name),
    prompt:'Enter checksum >'
  })]])
})


export { chksum, chksumSolve }