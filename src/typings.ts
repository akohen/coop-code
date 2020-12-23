import { Expedition, Player } from "./expedition"

export type appResponse = {
  errors?: string,
  output?: string,
  prompt?: string,
  expedition?: unknown
}

export type Runnable = (ctx: Context, args?: string) => string | undefined;

export interface Node {
  welcome: (ctx:Context) => string,
  commands?: Array<string>,
  connected?: Array<string>,
  files?: {[name: string]: string},
  isAvailable?: (ctx:Context) => boolean,
}

export type Command = {
  run: Runnable,
  help?: (isLongHelp: boolean) => string,
  isAvailable?: (ctx: Context) => boolean,
}

export type Context = {player: Player, expedition: Expedition}