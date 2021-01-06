import { Player } from "../player"
import { tutorial } from "../expeditions/tutorial";
import { Expedition } from "../expedition";
import { Backend } from "../typings";


const expeditions:Map<string,Expedition> = new Map()
const players:Map<string,Player> = new Map()

export const backend:Backend = {
  getPlayer(player: string): Promise<Player | undefined> {
    return Promise.resolve(players.get(player))
  },

  createPlayer(name: string): Promise<Player> {
    const player = new Player(name)
    players.set(name, player)
    return Promise.resolve(player)
  },

  getExpedition(name: string): Promise<Expedition | undefined> {
    return Promise.resolve(expeditions.get(name))
  },

  listExpeditions(): Promise<Array<Expedition>> {
    const validExpeditions = Array.from(expeditions.values()).filter(e => e.inProgress)
    return Promise.resolve(validExpeditions)
  },

  createExpedition(exp: Expedition, id?: string): Promise<Expedition> {
    const expID = id ? id : [...Array(6)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    expeditions.set(expID, exp)
    exp.id = expID
    return Promise.resolve(exp)
  },

  update(): Promise<void> {
    return Promise.resolve()
  }
}

const bob = new Player('bob')
players.set('foo', new Player('foo'))
players.set('bob', bob)
backend.createExpedition(tutorial.create().addPlayer(bob), 'tutorial')