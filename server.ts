import express from 'express';
import bodyParser from 'body-parser';
import game from './src/game';

const app = express();
const PORT = 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));


app.get('/', function (req, res) {
  res.sendFile('public/console.html' , { root : __dirname});
});


app.post('/', (req, res) => {
  try {
    const result = game(req.body)
    res.status((result.errors) ? 400 : 200).json(result)
  } catch (error) {
    res.status(500).json(error.message)
  }
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
