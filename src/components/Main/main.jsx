import React, { useState, useEffect } from 'react';
import GameTable from '../GameTable';
import css from './main.module.scss';

const Main = () => {
  const [currentNumber, setCurrentNumber] = useState(1);
  const [time, setTime] = useState(0);
  const [intervalId, setIntervalId] = useState();
  const [gameStatus, setGameStatus] = useState(0); // 0: ready, 1: game started, 2: game over
  const [freeze, setFreeze] = useState(false);

  const updateCurrentNumber = (selectedNumber) => {
    if (selectedNumber === currentNumber) {
      if (currentNumber !== 60) {
        setCurrentNumber((prevState) => ++prevState);
      } else {
        // win
        setGameStatus(2);
      }
    } else {
      // lose
      clearInterval(intervalId);
      setFreeze(true);
      setTime(0);
    }
  };

  useEffect(() => {
    if (gameStatus === 1) {
      setFreeze(false);
      setTime(0);
      setCurrentNumber(1);
      const id = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
      setIntervalId(id);
    } else {
      clearInterval(intervalId);
    }
  }, [gameStatus]);

  const startGame = () => {
    setGameStatus(1);
  };

  const resetGame = () => {
    setGameStatus(0);
    setTime(0);
    setCurrentNumber(1);
    setFreeze(false);
  };

  return (
    <div className={css.container}>
      <div className={css.time}>{(time / 1000).toFixed(2)}</div>
      <div
        className={`${css.currentNumber} text-light ${
          currentNumber === 60 ? 'bg-success' : 'bg-primary'
        } font-weight-bold`}
      >
        {currentNumber}
      </div>
      <div className={css.box}>
        {gameStatus === 0 && (
          <button
            className={`${css.startButton} text-light bg-primary`}
            onClick={startGame}
          >
            Start Game
          </button>
        )}
        {gameStatus === 1 && (
          <GameTable
            currentNumber={currentNumber}
            updateCurrentNumber={updateCurrentNumber}
            freeze={freeze}
          />
        )}
        {gameStatus === 2 && currentNumber === 60 && (
          <div className={`${css.winBox} text-light bg-success`}>
            <span className={`d-block mb-5`}>
              You {currentNumber === 60 ? 'Win!' : 'Lose'}
            </span>
            <span className={`d-block`}>
              Your Time: {(time / 1000).toFixed(2)}
            </span>
            <button
              className={`${css.reset} btn btn-light mt-5`}
              onClick={resetGame}
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {gameStatus === 1 && (
        <button
          type="button"
          className={`btn btn-dark btn-lg btn-block`}
          onClick={resetGame}
        >
          Reset
        </button>
      )}
    </div>
  );
};

export default Main;
