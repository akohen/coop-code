import express from 'express';
import game from './src/game';
import { login, register } from './src/github';
import { backend } from './src/backends';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


app.get('/', function (req, res) {
  res.sendFile('public/console.html' , { root : __dirname});
});

app.post('/', async (req, res) => {
  try {
    const result = await game(req.body['player'], req.body['secret'], req.body['cmd'], backend)
    res.status((result.errors) ? 400 : 200).json(result)
  } catch (error) {
    res.status(500).json(error.message)
  }
});

app.post('/update', async (req, res) => {
  try {
    const result = await game(req.body['player'], req.body['secret'], '', backend, true)
    res.status((result.errors) ? 400 : 200).json(result)
  } catch (error) {
    res.status(500).json(error.message)
  }
});

app.get('/oauth', login);
app.get('/oauth/register/:username', register);

app.get('/config', (req, res) => { // Temporary solution until this gets set during frontend build
  res.set('Cache-control', 'public, max-age=3000')
  res.json({
    github_client_id: process.env.GITHUB_CLIENT_ID,
    github_redirect_uri: process.env.GITHUB_REDIRECT_URI,
  })
})

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
