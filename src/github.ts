import got from "got";
import { Request, Response } from "express";

export const github = async (req:Request, res:Response): Promise<void> => {
  try {
    const gh = await got.post('https://github.com/login/oauth/access_token', {
      json: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: req.query.code,
      },
      responseType: 'json'
    })
    console.log(gh.body)

    const token:string = (gh.body as {access_token:string}).access_token as string
    const userDetails = await got.get('https://api.github.com/user', {
      headers: {Authorization: `token ${token}`}
    })
    
    res.status(200).send(userDetails.body)
  } catch (error) {
    res.status(500).json(error.message)
  }
}