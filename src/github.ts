import got from "got";
import { backend } from './backends';
import { Request, Response } from "express";

async function getUser(code:string) {
  const gh_request = await got.post('https://github.com/login/oauth/access_token', {
    json: {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    },
    responseType: 'json'
  })

  const gh = gh_request.body  as {access_token?:string, error_description?:string}
  if(gh.error_description || !gh.access_token) throw new Error(gh.error_description)

  const userDetails = await got.get('https://api.github.com/user', {
    headers: {Authorization: `token ${gh.access_token}`},
    responseType: 'json',
  })

  return (userDetails.body as {id:number}).id
}

export const login = async (req:Request, res:Response): Promise<void> => {
  try {
    if(typeof req.query.code != 'string') throw new Error('missing code')
    const userId = await getUser(req.query.code)
    if(typeof userId != 'number') throw new Error('Unable to retrieve github data')

    const player = await backend.login(userId)
    if(!player) throw new Error('User not found, register first')

    res.status(200).send(`<script>
    localStorage.setItem('player_id', '${player.id}')
    localStorage.setItem('player_secret', '${player.secret}')
    opener.loginCallback()
    self.close()
    </script>
    `)
  } catch (error) {
    res.status(500).send(`<script>
    opener.loginCallback('${error.message}')
    self.close()
    </script>
    `)
  }
}

export const register = async (req:Request, res:Response): Promise<void> => {
  try {
    if(!/^[A-Za-z0-9_-]+$/.test(req.params.username)) throw new Error('Incorrect username')
    if(typeof req.query.code != 'string') throw new Error('missing code')
    const userId = await getUser(req.query.code)
    if(typeof userId != 'number') throw new Error('Unable to retrieve github data')

    const player = await backend.createPlayer(req.params.username, userId)
    if(!player) throw new Error('Could not create player')
    
    res.status(200).send(`<script>
      localStorage.setItem('player_id', '${player.id}')
      localStorage.setItem('player_secret', '${player.secret}')
      opener.loginCallback(${(player.githubID == -1) ? "'Existing account found, logging in instead'" : ''})
      self.close()
    </script>
    `)
  } catch (error) {
    res.status(500).send(`<script>
    opener.loginCallback('${error.message}')
    self.close()
    </script>
    `)
  }
}