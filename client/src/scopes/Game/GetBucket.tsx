import axios from 'axios';
import { useEffect, useState, FC } from 'react';
import { IScore } from '../../interfaces/IScore';
import { useAppContext } from '../../contexts/AppContext';
import './game.css';
import standing from '../../assets/animations/animstop.gif'
import rim from '../../assets/animations/montage-splash-static.gif'
import swish from '../../assets/animations/montage-swish.gif'
import fail from '../../assets/animations/montage-splashfail.gif'
import bankShot from '../../assets/animations/montage-bankshot.gif'
import throwing from '../../assets/animations/throwing2.gif'

export interface IGetBucketProps {
  getNewScorePoint: (scoredPoints: number) => any;
  startUpdateGame: boolean;
}


export const GetBucket: FC<IGetBucketProps> = ({ getNewScorePoint, startUpdateGame }) => {
  const { token, setScores } = useAppContext();
  const [ctrlClick, setCtrlClick] = useState(0);
  const [imgMe, setImgMe] = useState(standing);
  const [imgBasket, setImgBasket] = useState(rim);
  const [scoredPoints, setScoredPoints] = useState(0);
  const [time, setTime] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameType, setGameType] = useState("update");


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
    let interval: any = null;

    if (gameStarted || startUpdateGame) {
      interval = setInterval(() => {
        setTime(prevTime => {

          if (prevTime === 1) {
            clearInterval(interval);
            setGameStarted(false);
          }
          return prevTime - 1;
        })

      }, 1000);
    }
    else if (time === 0) {
      gameType === "create" ? addScore() : updateScore();
      setTime(30);
      setScoredPoints(0);
    }
    return () => clearInterval(interval);


  }, [gameStarted, time, startUpdateGame]);


  const addScore = async () => {
    await axios.post('http://localhost:4242/score',
      {
        point: scoredPoints,
        idUser: localStorage.idUser,
        date: new Date().toLocaleDateString(),
      } as IScore,
      config);
    getScores();
    setGameType("update")//back to update mode by default
  };

  const updateScore = async () => {
    getNewScorePoint(scoredPoints);
  };

  const shoot = () => {
    if (!gameStarted && !startUpdateGame) {
      setGameStarted(true);
      setGameType("create");
    }

    setCtrlClick(prevClick => {

      if (prevClick === 0) {
        setImgMe(throwing);
        const animations = [swish, fail, bankShot];
        const random = Math.floor(Math.random() * animations.length);
        setImgBasket(animations[random]);
        window.setTimeout(() => {
          setImgMe(standing);
          if (random == 0 || random == 2) {
            setScoredPoints(prevScore => prevScore + 2)
          }
        }, 1200)

        window.setTimeout(function () {
          setImgBasket(rim);

          setCtrlClick(0);
        }, 1400)

      }
      return prevClick + 1
    });


  }

  return (
    <div className="perso">
      <div className="bucketGroup">
        <div className="bucket scoring">{scoredPoints}</div>
        <div className="shotClock scoring">{time}</div>
      </div>
      <div className="contain-me">
        <img alt="basket animations" className="basket" src={imgBasket} onClick={shoot} />
        <img alt="me" className="me" src={imgMe} />
      </div>
    </div>
  );
}
