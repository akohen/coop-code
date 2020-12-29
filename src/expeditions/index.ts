import { Expedition } from "../expedition";
import { Player } from "../player";

import { tutorial } from "./tutorial";
import { exp1 } from "./expedition1";
import { exp as twoPlayers } from "./2players";

export type ExpeditionFactory = {
  create: () => Expedition,
  load: (data: string) => Expedition,
  isAvailable?: (player: Player) => boolean,
}

export const expeditionFactories:Map<string, ExpeditionFactory> = new Map(Object.entries({
  tutorial,
  exp1,
  'two-players':twoPlayers,
}));