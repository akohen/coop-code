import { Player } from "../player"
import { Expedition } from "../expedition";
import { Backend } from "../typings";


const expeditions:Map<string,Expedition> = new Map()
const players:Map<string,Player> = new Map()

export const memory:Backend = {
  getPlayer(id: string, secret: string): Promise<Player | undefined> {
    const player = players.get(id)
    if(player?.secret == secret) return Promise.resolve(player)
    return Promise.resolve(undefined)
  },

  login(githubID) {
    for(const player of players.values()) {
      if(player.githubID == githubID) return Promise.resolve(player)
    }
    return Promise.resolve(undefined)
  },

  createPlayer(name: string, githubID?: number): Promise<Player> {
    const player = new Player(name)
    player.id = Math.random().toString(36).substring(7)
    player.secret = Math.random().toString(36).substring(7)
    player.githubID = githubID // Multiple users with the same ID allowed for easier testing
    players.set(player.id, player)
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