export type cmdReturn = {
  code: number,
  out?: string,
  err?: string
}
export type cmdFunction = (args?: string) => cmdReturn
export interface Node {
  welcome: string,
  commands?: Array<string>,
  connected?: Array<string>,
  lock?:{
    value: number,
    error: string,
  },
}

export type Player = {
  id: string,
  name: string,
  nodes: [string],
}

export type Command = {
  run: (ctx: unknown, args?: string) => string | undefined,
  help?: (isLongHelp: boolean) => string,
  isAvailable?: (ctx: Context) => boolean,
}

export type Context = unknown