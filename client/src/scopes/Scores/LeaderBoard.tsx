import axios from 'axios';
import { useEffect, useState } from 'react';
import { IUser } from '../../interfaces/IUser';
import { useAppContext } from '../../contexts/AppContext';
import './Scores.css';


interface ILeader extends IUser {
  totalScore?: number;
}

export const LeaderBoard = () => {
  const { token, scores, users } = useAppContext();
  const [leaders, setLeaders] = useState<ILeader[]>([]);


  const config = {
    headers: {
      'Authorization': `${token}`
    }
  };

  useEffect(() => {
    (async () => {
      const leadersResults = await axios.get(`http://localhost:4242/score/leader`, config);
      const leadersData: { idUser: any; totalScore: any; }[] = leadersResults.data.leaders;
      const leadersIdsSet = new Set<number>(leadersData.map((leadersResult: { idUser: any; totalScore: any; }) => leadersResult.idUser));
      setLeaders(() => {
        const filteredUsers: ILeader[] = users.filter(user => leadersIdsSet.has(user.id))

        filteredUsers.forEach(user => {
          user.totalScore = leadersData.find(leader => leader.idUser === user.id)?.totalScore
        })
        return filteredUsers.sort((a, b) => b.totalScore! - a.totalScore!)
      });

    })();

  }, [scores, users]);

  return (
    <table>
      <thead>
        <tr>
          <th>username</th>
          <th>total score</th>
        </tr>
      </thead>
      <tbody>
        {
          leaders.map(leader => (
            <tr key={leader.id}>
              <td>{leader.username}</td>
              <td>{leader.totalScore}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}
