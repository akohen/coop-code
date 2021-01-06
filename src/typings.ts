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
export type AsyncRunnable = (ctx: Context, args?: string) => Promise<string | undefined>;

export interface Node {
  welcome?: Runnable,
  tags?: Array<string>,
  files?: {[name: string]: string},
  isAvailable?: (ctx:Context) => boolean,
}

export type Command = {
  run: Runnable,
  help?: (isLongHelp?: boolean) => string,
  isAvailable?: (ctx: Context) => boolean,
}
export type AsyncCommand = {
  run: AsyncRunnable,
  help?: (isLongHelp?: boolean) => string,
  isAvailable?: (ctx: Context) => boolean,
}

export interface Backend {
  getPlayer:        (player: string) => Promise<Player | undefined>,
  createPlayer:     (name: string) => Promise<Player>,
  getExpedition:    (name: string) => Promise<Expedition | undefined>,
  listExpeditions:  () => Promise<Array<Expedition>>,
  createExpedition: (exp: Expedition, id?: string) => Promise<Expedition>,
  update:           (ctx: Context) => Promise<void>,
}

export enum ExpeditionStatus {
  InProgress  = "In progress",
  Failed      = "Failed",
  Completed   = "Completed",
}

export type Context = {player: Player, expedition: Expedition, backend: Backend}