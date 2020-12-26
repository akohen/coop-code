import { Expedition } from "../expedition";
import { Player } from "../player";

import { test } from "./test";

export type ExpeditionFactory = {
  create: () => Expedition,
  load: (data: string) => Expedition,
  isAvailable?: (player: Player) => boolean,
}

export const allExpeditions:Map<string, ExpeditionFactory> = new Map(Object.entries({
  tutorial: test,
}));