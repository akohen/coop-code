import { Player } from "../player"
import { tutorial } from "../expeditions/tutorial";
import { Expedition } from "../expedition";
import { Backend } from "../typings";


const expeditions:Map<string,Expedition> = new Map()
const players:Map<string,Player> = new Map()

export const backend:Backend = {
  getPlayer(player: string): Promise<Player | undefined> {
    return new Promise(resolve => resolve(players.get(player)))
  },

  createPlayer(name: string): Promise<Player> {
    const player = new Player(name)
    players.set(name, player)
    return new Promise(resolve => resolve(player))
  },

  getExpedition(name: string): Promise<Expedition | undefined> {
    return new Promise(resolve => resolve(expeditions.get(name)))
  },

  listExpeditions(): Promise<Array<Expedition>> {
    const validExpeditions = Array.from(expeditions.values()).filter(e => e.inProgress)
    return new Promise(resolve => resolve(validExpeditions))
  },

  createExpedition(exp: Expedition, id?: string): Promise<Expedition> {
    const expID = id ? id : [...Array(6)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    expeditions.set(expID, exp)
    exp.id = expID
    return new Promise(resolve => resolve(exp))
  },

  update(): Promise<void> {
    return new Promise(resolve => resolve())
  }
}

const bob = new Player('bob')
players.set('foo', new Player('foo'))
players.set('bob', bob)
backend.createExpedition(tutorial.create().addPlayer(bob), 'tutorial')