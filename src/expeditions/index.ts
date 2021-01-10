import { tutorial } from "./tutorial";
import { ExpeditionFactory } from "../expedition-factory";
import { easy1 } from "./easy1";

export const expeditionFactories:Map<string, ExpeditionFactory> = new Map([
  easy1,
  tutorial
].map(f => [f.type,f]));