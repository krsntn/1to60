import React, { useState, useEffect, useContext, useCallback } from 'react';
import GameTable from '../GameTable';
import css from './main.module.scss';
import firebase from 'firebase';
import DeviceDetector from 'device-detector-js';
import { startDB } from '../utils/firebase-config';
import blockedNames from '../utils/blockedNames';
import { GameContext } from '../../stores/gameContext';
import { TimeContext } from '../../stores/timeContext';
import { LeaderboardContext } from '../../stores/leaderboardContext';

startDB();
const database = firebase.database();
const leaderboardDB = database.ref('leaderboard');
const logDB = database.ref('log');
const deviceDetector = new DeviceDetector();

function errData(err) {
  console.error(err);
}

const Main = () => {
  const [intervalId, setIntervalId] = useState();

  const gameContext = useContext(GameContext);
  const { state, dispatch } = gameContext;
  const { currentNumber, freeze, gameStatus } = state;

  const timeContext = useContext(TimeContext);
  const { state: timeState, dispatch: timeDispatch } = timeContext;
  const { time } = timeState;

  const leaderboardContext = useContext(LeaderboardContext);
  const { dispatch: leaderboardDispatch } = leaderboardContext;

  const gotData = useCallback(
    (data) => {
      const localData = [];
      const records = data.val();
      if (records) {
        const keys = Object.keys(records);
        for (const key of keys) {
          localData.push({ name: key, ...records[key] });
        }
        const finalOutput = localData.sort((a, b) =>
          a.speed > b.speed ? 1 : -1
        );
        leaderboardDispatch({ type: 'setData', payload: finalOutput });
      }
    },
    [leaderboardDispatch]
  );

  const updateCurrentNumber = useCallback(
    (selectedNumber) => {
      if (selectedNumber === currentNumber) {
        if (selectedNumber < 60) {
          dispatch({
            type: 'updateCurrentNumber',
            payload: selectedNumber + 1,
          });
        } else {
          // win
          dispatch({ type: 'win' });
        }
      } else {
        // lose
        clearInterval(intervalId);
        dispatch({ type: 'lose' });
        timeDispatch({ type: 'updateTime', payload: 0 });
      }
    },
    [currentNumber, dispatch, timeDispatch, intervalId]
  );

  useEffect(() => {
    leaderboardDB
      .orderByChild('speed')
      .limitToFirst(20)
      .on('value', gotData, errData);
  }, [gotData]);

  useEffect(() => {
    if (gameStatus === 1 && intervalId === undefined) {
      // start game
      dispatch({ type: 'start' });
      timeDispatch({ type: 'updateTime', payload: 0 });
      const id = setInterval(() => {
        timeDispatch({ type: 'updateTime' });
      }, 10);
      setIntervalId(id);
    } else if (gameStatus === 0) {
      // back to menu
      clearInterval(intervalId);
      dispatch({ type: 'reset' });
    } else if (gameStatus === 2) {
      // end game
      clearInterval(intervalId);
      setIntervalId();
    }
  }, [gameStatus, intervalId, dispatch, timeDispatch]);

  const startGame = () => {
    fetch('https://ipapi.co/json/')
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          const device = deviceDetector.parse(window.navigator.userAgent);
          const log = {
            time: firebase.database.ServerValue.TIMESTAMP,
            geolocation: {
              ip: data.ip,
              city: data.city,
              region: data.region,
              region_code: data.region_code,
              country: data.country,
              country_code: data.country_code,
              country_name: data.country_name,
              postal: data.postal,
              latitude: data.latitude,
              longitude: data.longitude,
              timezone: data.timezone,
              country_calling_code: data.country_calling_code,
              currency: data.currency,
              asn: data.asn,
              org: data.org,
            },
            device: device,
          };
          logDB.push(log);
        }
      });

    dispatch({ type: 'start' });
  };

  const resetGame = () => {
    dispatch({ type: 'reset' });
    timeDispatch({ type: 'updateTime', payload: 0 });
  };

  const submitName = (event) => {
    event.preventDefault();
    const name = document.querySelector('#inlineFormInputName').value;

    if (
      name.trim().length === 0 ||
      name.length > 30 ||
      blockedNames.includes(name)
    ) {
      alert('Invalid name.');
      return;
    }

    const newData = {
      speed: time / 1000,
      time: firebase.database.ServerValue.TIMESTAMP,
    };

    firebase
      .database()
      .ref(`leaderboard/${name}`)
      .once('value', (data) => {
        if (data.val()) {
          const record = data.val();
          if (newData.speed < record.speed) {
            database.ref(`leaderboard/${name}`).set(newData);
          }
        } else {
          database.ref(`leaderboard/${name}`).set(newData);
        }
      });

    resetGame();
  };

  return (
    <div className={css.container}>
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
          <GameTable updateCurrentNumber={updateCurrentNumber} />
        )}
        {gameStatus === 2 && currentNumber === 60 && (
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
    </div>
  );
};

export default Main;
