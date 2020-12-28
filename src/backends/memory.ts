import { Player } from "../player"
import { test } from "../expeditions/test";
import { Expedition } from "../expedition";

const players = new Map()
players.set('foo', new Player('foo'))
players.set('bob', new Player('bob'))
const expeditions:Map<string,Expedition> = new Map()
expeditions.set('tutorial',test.create().addPlayer(players.get('bob')))

export const backend = {
  getPlayer(player: string): Player | undefined {
    return players.get(player)
  },

  getExpedition(name: string): Expedition | undefined {
    return expeditions.get(name)
  },

  listExpeditions(): Array<string> {
    const validExpeditions = Array.from(expeditions).filter(e => !e[1].isComplete)
    return validExpeditions.map(e => e[0].padEnd(15) + e[1].type.padEnd(15) + e[1].players.size)
  },

  createExpedition(exp: Expedition): Expedition {
    const id = [...Array(6)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    expeditions.set(id, exp)
    exp.id = id
    return exp
  },
}