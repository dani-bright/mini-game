import express from 'express';
import bodyParser from 'body-parser';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Score } from './src/entity/Score';
import { User } from './src/entity/User';
import cors from 'cors';
import UserController from './src/controller/UserController';
import { allowConnectedUsersOnly } from './src/middlerwware/AuthorizationMiddleware';
import ScoreController from './src/controller/ScoreController';

const port = 4242;
const app = express();

app.use(cors());


app.use(bodyParser.json({ limit : '50mb'}));
app.use(bodyParser.urlencoded({ limit : '50mb', extended : true }));

app.get('/hello', (req, res) => {
  res.status(200).end();
});

app.post('/user/login', UserController.login) ;

app.use(allowConnectedUsersOnly());

app.get('/user', UserController.getAllUsers) ;

app.get('/score', ScoreController.getAllScores);
app.post('/score/average', ScoreController.getAVGPointsByDate);
app.get('/score/leader', ScoreController.getScoreLeaders);
app.post('/score', ScoreController.add);
app.put('/score/:id', ScoreController.update) ;
app.delete('/score/:id', ScoreController.remove) ;


// Connexion à la base
createConnection({
    type : 'mysql',
    host : 'docker-mysql',
    port : 3306,
    username : 'root',
    password : 'smartdb',
    database : 'smart-bdd',
    synchronize : true,
    logging : false,
    charset : 'utf8mb4',
    entities : [
        Score,
        User,
    ]
}).then(async connection => {
    console.log('Connected to DB');
    // Connexion au serveur
    app.listen(port, () => {
      console.log(`Running on port ${port}`);
    });
}).catch(error => console.log('TypeORM connection error: ', error));

export default app;