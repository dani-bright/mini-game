import axios from 'axios';
import { useState, ChangeEvent, useEffect, FC } from 'react';
import { IScore } from '../../interfaces/IScore';
import { IUser } from '../../interfaces/IUser';
import { useAppContext } from '../../contexts/AppContext';
import { LeaderBoard } from './LeaderBoard';

import './Scores.css';
export interface IStatsProps {
  scores: IScore[];
}

export const Stats: FC<IStatsProps> = ({ scores }) => {
  const { token } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(scores[0].date);
  const [average, setAverage] = useState(undefined);
  const [dates, setDates] = useState<string[]>([]);



  const config = {
    headers: {
      'Authorization': `${token}`
    }
  };

  useEffect(() => {
    (async () => {
      const average = await axios.post(`http://localhost:4242/score/average`, { selectedDate },
        config);
      setAverage(average.data.average);
      setDates([
        ...new Map(
          scores.map(score => [score.date, score.date])
        ).values()
      ]);

    })();

  }, [scores]);


  const getAverageScore = async (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setSelectedDate(e.target.value);

    const average = await axios.post(`http://localhost:4242/score/average`, { selectedDate }, config);
    setAverage(average.data.average);

  };


  return (
    <div className="stats">
      <p className="heading">Moyenne de score par jour</p>
      <select onChange={getAverageScore}>
        {dates.map(date => <option key={date}>{date}</option>)}
      </select>
      <p className="average">{average}</p>
      <p className="heading">Top 5</p>
      <LeaderBoard />
    </div>
  );
}
