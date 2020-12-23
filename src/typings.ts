import { Expedition, Player } from "./expedition"

export type appResponse = {
  errors?: string,
  output?: string,
  prompt?: string,
  expedition?: unknown
}

export interface Node {
  welcome: (ctx:Context) => string,
  commands?: Array<string>,
  connected?: Array<string>,
  files?: {[name: string]: string},
  isAvailable?: (ctx:Context) => boolean,
}

export type Command = {
  run: (ctx: Context, args?: string) => string | undefined,
  help?: (isLongHelp: boolean) => string,
  isAvailable?: (ctx: Context) => boolean,
}

export type Context = {player: Player, expedition: Expedition}