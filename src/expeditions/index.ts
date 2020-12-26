import { Expedition } from "../expedition";
import { Player } from "../player";

import { test } from "./test";
import { exp1 } from "./expedition1";

export type ExpeditionFactory = {
  create: () => Expedition,
  load: (data: string) => Expedition,
  isAvailable?: (player: Player) => boolean,
}

export const expeditionFactories:Map<string, ExpeditionFactory> = new Map(Object.entries({
  tutorial: test,
  exp1,
}));