import { Pool } from 'pg'
import { expeditionFactories } from '../expeditions'
import { Player } from '../player'
import { Backend, ExpeditionStatus } from '../typings'


const pool = new Pool()

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
})

const restoreExpedition = (data:{type: string, variables:string, expedition_id:string, players:string[], enddate:Date|undefined, last_updated:Date}) => {
  const factory = expeditionFactories.get(data.type)
  if(!factory) throw new Error('Unable to restore expedition') //TODO maybe this should reset to HQ and display an error ?
  const expedition = factory.load(data.variables)
  expedition.id = data.expedition_id
  expedition.players = data.players
  expedition.lastUpdated = data.last_updated
  if(data.enddate) expedition.endDate = data.enddate
  return expedition
}

export const pg:Backend = {
  async getPlayer(name: string) {
    try {
      const { rows:[playerData] } = await pool.query('SELECT * FROM players LEFT JOIN expeditions USING(expedition_id) WHERE name=$1 LIMIT 1', [name])
      if(!playerData) return
      const player = new Player(playerData.name)
    
      if(!playerData.type) return player
      try {
        player.expedition = restoreExpedition(playerData)
      } catch (error) {
        player.returnToHQ()
        return player
      }

      if(playerData.nodes) player.nodes = playerData.nodes
      if(playerData.input) player.input = playerData.input
      return player
    } catch (error) {
      console.error(error.message)
      throw new Error('Unable to get user')
    }
  },

  async createPlayer(name: string) {
    const player = new Player(name)
    try {
      const values = [player.name, player.nodes]
      await pool.query('INSERT INTO players(name, nodes) VALUES($1, $2) RETURNING *', values)
      return player
    } catch (error) {
      console.error(error.message)
      throw new Error('Unable to create user')
    }
  },

  async getExpedition(id: string) {
    try {
      const { rows:[expeditionData] } = await pool.query(
        'SELECT * FROM expeditions WHERE status = $1 AND expedition_id::text LIKE $2 LIMIT 1',
        [ExpeditionStatus.InProgress, id+'%']
      )
      if(!expeditionData) return
      return restoreExpedition(expeditionData)
    } catch (error) {
      console.error(error.message)
      throw new Error('Unable to get user')
    }
  },

  async listExpeditions(player?:string) {
    try {
      const query = player ? 
        'SELECT * FROM expeditions WHERE status != $1 AND $2 = ANY(players) ORDER BY last_updated DESC LIMIT 25' :
        'SELECT * FROM expeditions WHERE status = $1 AND (enddate IS NULL OR enddate > now()) ORDER BY last_updated DESC LIMIT 25'
      const variables = player ? [ExpeditionStatus.InProgress, player] : [ExpeditionStatus.InProgress]
      const { rows } = await pool.query(query, variables)
      if(!rows) return []
      return rows.map(r => restoreExpedition(r))
    } catch (error) {
      console.error(error.message)
      throw new Error('Unable to get user')
    }
  },

  async createExpedition(expedition) {
    try {
      const { rows:[expeditionData] } = await pool.query(
        'INSERT INTO expeditions(type, enddate, variables, status) VALUES($1, $2, $3, $4) RETURNING *', 
        [expedition.type, expedition.endDate, expedition.export(), expedition.status]
      )
      expedition.id = expeditionData.expedition_id
      return expedition
    } catch (error) {
      console.error(error.message)
      throw new Error('Unable to create expedition')
    }
    
  },

  async update(ctx): Promise<void> {
    try {
      const values =  (ctx.player.expedition.type == 'hq') ? 
        [ctx.player.nodes,undefined,undefined,ctx.player.name] : 
        [ctx.player.nodes, ctx.player.input, ctx.player.expedition.id, ctx.player.name]
      await pool.query('UPDATE players SET nodes = $1, input = $2, expedition_id = $3 WHERE name = $4',values)
      if(ctx.expedition.type != 'hq') {
        await pool.query(
          'UPDATE expeditions SET variables = $1, status = $2, players = $3 WHERE expedition_id = $4',
          [ctx.expedition.export(), ctx.expedition.status, ctx.expedition.players, ctx.expedition.id]
        )
      }
      if(ctx.player.prevExpedition && ctx.player.prevExpedition.type != 'hq') {
        await pool.query(
          'UPDATE expeditions SET variables = $1, status = $2, players = $3 WHERE expedition_id = $4',
          [ctx.player.prevExpedition.export(), ctx.player.prevExpedition.status, ctx.player.prevExpedition.players, ctx.player.prevExpedition.id]
        )
      }
    } catch (error) {
      console.error(error.message)
      throw new Error('Error during state save')
    }
    return
  }
}
