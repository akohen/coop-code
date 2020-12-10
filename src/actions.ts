import expedition from './expedition';
export type cmdReturn = {
  code: number,
  out?: string,
  err?: string
}

type cmdFunction = (args?: string) => cmdReturn

const availableCommands: {[idx: string] : cmdFunction} = {
  node: (args) => {
    const nodeId = Number(args)
    expedition.players[0].location = nodeId
    return {code:1, out:expedition.nodes[nodeId]}
  },
  echo: (args) => ({code:1, out: args}),
  err: (args) => ({code: -1, err: args}),
  foo: () => ({code: -12}),
}

function execute(cmd: string, args?: string) : cmdReturn {
  if (availableCommands[cmd] != undefined) {
    return availableCommands[cmd](args)
  }
  return {code: -1}
}

function getState() {
  return expedition;
}

export { execute, getState }

