import { tutorial } from "./tutorial";
import { ExpeditionFactory } from "../expedition-factory";
import { easy1 } from "./easy1";
import { easy2 } from "./easy2";

export const expeditionFactories:Map<string, ExpeditionFactory> = new Map([
  easy1,
  easy2,
  tutorial
].map(f => [f.type,f]));