import express from 'express';
import bodyParser from 'body-parser';
import game from './src/game';
import { memory } from './src/backends/memory';
import { pg } from './src/backends/pg';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));


app.get('/', function (req, res) {
  res.sendFile('public/console.html' , { root : __dirname});
});

app.post('/', async (req, res) => {
  try {
    const backend = (process.env.PGHOST) ? pg : memory
    const result = await game(req.body['player'], req.body['cmd'], backend)
    res.status((result.errors) ? 400 : 200).json(result)
  } catch (error) {
    res.status(500).json(error.message)
  }
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
