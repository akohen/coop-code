import seedrandom from "seedrandom";
import { Expedition } from "./expedition";
import { Player } from "./player";

export class ExpeditionFactory {
  type: string;
  private _create: (variables:Map<string,string|number|boolean>) => Expedition
  isAvailable?: (player: Player) => boolean
  players?: number
  difficulty?: string

  constructor({type, create, isAvailable, players, difficulty}: 
    {
      type: string,
      create: (variables:Map<string,string|number|boolean>) => Expedition,
      isAvailable?:(player: Player) => boolean,
      players?: number,
      difficulty?: string
    }) {
    this.type = type
    this._create = create
    this.isAvailable = isAvailable
    this.difficulty = difficulty
    this.players = players
  }

  create(
    {id, players, last_updated, enddate, variables}:
    {id?:string, players?:string[], last_updated?:Date, enddate?:Date, variables?:Map<string,string|number|boolean>} = {}
  ):Expedition {
    const varMap = (variables) ? variables : new Map([['_seed', `${this.type}-${Date.now()}-0`]])
    const expedition = this.tryCreation(varMap)
    
    // This is done here instead of inside the create function to ensure consistency
    // as this prevents having different values between creation and factory indexing
    expedition.type = this.type 
    if(id) expedition.id = id
    if(players) expedition.players = players
    if(last_updated) expedition.lastUpdated = last_updated
    if(enddate) expedition.endDate = enddate
    return expedition
  }

  private tryCreation(variables:Map<string,string|number|boolean>):Expedition {
    let seed = variables.get('_seed') as string
    let tryCount = parseInt(seed.slice(-1))
    while(tryCount < 5) {
      try {
        seedrandom(seed, { global: true })
        return this._create(variables)
      } catch (e) {
        console.log('Create error on seed', seed)
        tryCount+=1
        seed = seed.slice(0,-1) + tryCount
        variables.set('_seed', seed)
      }
    }
    console.error('Failed to create expedition with seed', seed)
    throw new Error('Unable to create expedition')
  }
}