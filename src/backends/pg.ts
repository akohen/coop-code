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
  if(!factory) throw new Error('Unable to restore expedition')
  const variables:Map<string,string|number|boolean> = new Map(JSON.parse(data.variables))
  const expedition = factory.create({
    id:data.expedition_id,
    players: data.players,
    last_updated: data.last_updated,
    enddate: data.enddate,
    variables,
  })
  return expedition
}

export const pg:Backend = {
  async getPlayer(id: string, secret: string) {
    try {
      const { rows:[playerData] } = await pool.query(
        'SELECT * FROM players LEFT JOIN expeditions USING(expedition_id) WHERE id=$1 and secret=$2 LIMIT 1',
        [id, secret]
      )
      if(!playerData) return
      const player = new Player(playerData.name)
    
      if('tags' in playerData) player.tags = playerData.tags
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
      return
    }
  },

  async login(githubID) {
    try {
      const { rows:[playerData] } = await pool.query('SELECT * FROM players WHERE github=$1 LIMIT 1', [githubID])
      if(!playerData) return
      const player = new Player(playerData.name)
      if(playerData.id) player.id = playerData.id
      if(playerData.secret) player.secret = playerData.secret
      return player
    } catch (error) {
      console.error(error.message)
      return
    }
  },

  async createPlayer(name: string, githubID?: number) {
    try {
      const player = new Player(name)
      const values = [player.name, player.nodes, githubID]
      const { rows:[playerData] } = await pool.query('INSERT INTO players(name, nodes, github) VALUES($1, $2, $3) RETURNING *', values)
      
      if(playerData.id) player.id = playerData.id
      if(playerData.secret) player.secret = playerData.secret
      return player
    } catch (error) {
      if(error.constraint == 'github_unique') {
        const player = await pg.login(githubID as number)
        if(player) player.githubID = -1
        return player
      }
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
      throw new Error(`Unable to get expedition ${id}`)
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
      throw new Error('Unable to list expeditions')
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
  },

  async stats() {
    try {
      const query = 'SELECT (SELECT count(*)::integer FROM players) as players, (SELECT count(*)::integer FROM expeditions) as expeditions'
      const { rows:[stats] } = await pool.query(query)
      return stats
    } catch (error) {
      console.error(error.message)
      throw new Error('Unable to get stats')
    }
  }
}
