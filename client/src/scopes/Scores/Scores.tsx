import axios from 'axios';
import { useEffect, useState } from 'react';
import { IScore } from '../../interfaces/IScore';
import { useAppContext } from '../../contexts/AppContext';
import { GetBucket } from '../Game/GetBucket';
import { Score } from './Score';
import './Scores.css';
import { Stats } from './Stats';

export default function Scores() {
  const { token, setScores, scores, setUsers } = useAppContext();
  const [idScore, setIdScore] = useState<number | undefined>(undefined);
  const [updateGameStarted, setUpdateGameStarted] = useState<boolean>(false);
  const config = {
    headers: {
      'Authorization': `${token}`
    }
  };
  const getScores = async () => {
    const scores = await axios.get('http://localhost:4242/score', config);
    setScores(scores.data.scores);
  }
  useEffect(() => {
    (async () => {
      getScores();
      const users = await axios.get('http://localhost:4242/user', config);
      setUsers(users.data.users);
    })();

  }, []);

  const updateScore = async (idScoreToUpdate: number) => {
    setUpdateGameStarted(true);
    setIdScore(idScoreToUpdate);
    setTimeout(() => { setUpdateGameStarted(false) }, 31000)//change of this state will trigger the timer to stop itslef
  };

  const getNewScorePoint = async (newScoredPoint: number) => {
    await axios.put(`http://localhost:4242/score/${idScore}`,
      {
        point: newScoredPoint,
        date: new Date().toLocaleDateString(),
      } as IScore,
      config);
    getScores();
  }

  const scoreTable = scores.length && (
    <table>
      <thead>
        <tr>
          <th>username</th>
          <th>score</th>
          <th>date</th>
          <th>actions</th>

        </tr>
      </thead>
      <tbody>
        {
          scores.map(score => <Score key={score.id} score={score} startNewGame={updateScore} />)
        }

      </tbody>
    </table>
  );
  return (
    <div>
      <header className="Scores-header">
        <GetBucket getNewScorePoint={getNewScorePoint} startUpdateGame={updateGameStarted} />
      </header>
      <div className="Scores">
        <div className="table">
          {
            !scores.length
              ? <p>No score registered yet click on the hoop to start playing</p>
              : scoreTable
          }
        </div>

        {scores.length ? <Stats scores={scores} /> : null}
      </div>
    </div>

  );
}
