import axios from 'axios';
import { MouseEvent, FC, useState } from 'react';
import { IScore } from '../../interfaces/IScore';
import { useAppContext } from '../../contexts/AppContext';

import './Scores.css';
export interface IScoreProps {
  score: IScore;
  startNewGame: (idScore: number) => any;
}
export const Score: FC<IScoreProps> = ({ score, startNewGame }) => {
  const { token, setScores, users } = useAppContext();
  const [updating, setUpdating] = useState(false);


  const config = {
    headers: {
      'Authorization': `${token}`
    }
  };

  const getScores = async () => {
    const scores = await axios.get('http://localhost:4242/score', config);
    setScores(scores.data.scores);
  }
  const user = users.find(user => score.idUser === user.id);

  const deleteScore = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await axios.delete(`http://localhost:4242/score/${score.id}`, config);
    getScores();
  };

  const updateScore = () => {
    startNewGame(score.id);
    setUpdating(true)
    setTimeout(() => { setUpdating(false) }, 31000)
  }

  const updateButton = !updating ? <button className="button update" onClick={updateScore}>Améliorer</button> : <span>Playing...</span>;

  const deleteButton = !updating ? <button className="button delete" onClick={deleteScore}>supprimer</button> : null;


  return (
    <tr key={score.id}>
      <td>{user?.username}</td>
      <td>{score.point}</td>
      <td>{new Date(score.date).toDateString()}</td>
      <td>
        {user?.id === parseInt(localStorage.idUser)
          ? (
            <>
              {deleteButton}
              {updateButton}
            </>
          ) : null}
      </td>
    </tr>
  );
}
