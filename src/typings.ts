import { Expedition } from "./expedition"
import { Player } from "./player";

export type appResponse = {
  errors?: string,
  output?: string,
  prompt?: string,
  expedition?: unknown
}

export interface ExpeditionModule {
  nodes?: Array<[string,Node]>,
  variables?: Map<string, string|number|boolean>
  commands?: Map<string,Command>
}
export type Runnable = (ctx: Context, args?: string) => string | undefined;

export interface Node {
  welcome: (ctx:Context) => string,
  tags?: Array<string>,
  files?: {[name: string]: string},
  isAvailable?: (ctx:Context) => boolean,
}

export type Command = {
  run: Runnable,
  help?: (isLongHelp?: boolean) => string,
  isAvailable?: (ctx: Context) => boolean,
}

export type Context = {player: Player, expedition: Expedition}