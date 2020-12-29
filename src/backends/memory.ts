import { Player } from "../player"
import { tutorial } from "../expeditions/tutorial";
import { Expedition } from "../expedition";
import { Backend } from "../typings";


const expeditions:Map<string,Expedition> = new Map()
const players = new Map()

export const backend:Backend = {
  getPlayer(player: string): Player | undefined {
    return players.get(player)
  },

  createPlayer(name: string): Player {
    const player = new Player(name)
    players.set(name, player)
    return player
  },

  getExpedition(name: string): Expedition | undefined {
    return expeditions.get(name)
  },

  listExpeditions(): Array<Expedition> {
    const validExpeditions = Array.from(expeditions.values()).filter(e => e.inProgress)
    return validExpeditions
  },

  createExpedition(exp: Expedition, id?: string): Expedition {
    const expID = id ? id : [...Array(6)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    expeditions.set(expID, exp)
    exp.id = expID
    return exp
  },

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  update(): void {}
}

players.set('foo', new Player('foo'))
players.set('bob', new Player('bob'))
backend.createExpedition(tutorial.create().addPlayer(players.get('bob')), 'tutorial')