import express from 'express';
import bodyParser from 'body-parser';
import game from './src/game';

const app = express();
const PORT = 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Express + TypeScript Server'));

app.post('/', (req, res) => res.json(game(req.body)));

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
