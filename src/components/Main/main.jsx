import React, { useState, useEffect } from 'react';
import GameTable from '../GameTable';
import Leaderboard from '../Leaderboard';
import css from './main.module.scss';
import firebase from 'firebase';
import { startDB } from '../utils/firebase-config';

startDB();
const database = firebase.database();
const ref = database.ref('leaderboard');

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
        setCurrentNumber('Finished');
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
    if (gameStatus === 1 && intervalId === undefined) {
      setFreeze(false);
      setTime(0);
      setCurrentNumber(1);
      const id = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
      setIntervalId(id);
    } else if (gameStatus !== 1) {
      setIntervalId();
      clearInterval(intervalId);
    }
  }, [gameStatus, intervalId]);

  const startGame = () => {
    setGameStatus(1);
  };

  const resetGame = () => {
    setGameStatus(0);
    setTime(0);
    setCurrentNumber(1);
    setFreeze(false);
  };

  const submitName = (event) => {
    event.preventDefault();
    const name = document.querySelector('#inlineFormInputName').value;
    const data = {
      name: name,
      speed: time / 1000,
    };
    ref.push(data);

    resetGame();
  };

  return (
    <div className={css.container}>
      <div className={css.time}>{(time / 1000).toFixed(2)}</div>
      <div
        className={`${css.currentNumber} text-light ${
          !freeze && currentNumber === 'Finished' ? 'bg-success' : ''
        } ${!freeze && currentNumber !== 'Finished' ? 'bg-primary' : ''} ${
          freeze ? 'bg-danger' : ''
        } font-weight-bold`}
      >
        {freeze ? 'Game Over' : currentNumber}
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
        {gameStatus === 2 && currentNumber === 'Finished' && (
          <div className={`${css.winBox} text-light bg-success`}>
            <span className={`d-block mb-5`}>
              You {currentNumber === 'Finished' ? 'Win!' : 'Lose'}
            </span>
            <span className={`d-block`}>
              Your Time: {(time / 1000).toFixed(2)}
            </span>
            <form className={`form-inline`}>
              <div className={`form-row align-items-center`}>
                <div className="my-1">
                  <label className="sr-only" htmlFor="inlineFormInputName">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inlineFormInputName"
                    placeholder="Name"
                  />
                </div>
                <div className="col-auto my-1">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={submitName}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
            <button className={`btn btn-light mt-5`} onClick={resetGame}>
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

      <div className={css.leaderboardContainer}>
        Leaderboard
        <Leaderboard db={ref} />
      </div>
    </div>
  );
};

export default Main;
