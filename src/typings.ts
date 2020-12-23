import { Expedition, Player } from "./expedition"

export interface Node {
  welcome: string,
  commands?: Array<string>,
  connected?: Array<string>,
  lock?:{
    value: number,
    error: string,
  },
  files?: {[name: string]: string}
}

export type Command = {
  run: (ctx: Context, args?: string) => string | undefined,
  help?: (isLongHelp: boolean) => string,
  isAvailable?: (ctx: Context) => boolean,
}

export type Context = {player: Player, expedition: Expedition}