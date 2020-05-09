import React, { createContext, useReducer } from 'react';

const initialState = {
  currentNumber: 1,
  gameStatus: 0, // 0: ready, 1: game started, 2: game over
  freeze: false,
  leaderboardData: [],
};

const GameContext = createContext(initialState);

const GameContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'updateCurrentNumber':
        return {
          ...state,
          currentNumber: action.payload,
        };
      case 'start':
        return {
          ...state,
          freeze: false,
          gameStatus: 1,
          currentNumber: 1,
        };
      case 'reset':
        return {
          ...state,
          freeze: false,
          gameStatus: 0,
          currentNumber: 1,
        };
      case 'win':
        return {
          ...state,
          gameStatus: 2,
        };
      case 'lose':
        return {
          ...state,
          freeze: true,
        };
      case 'setLeaderboard':
        return {
          ...state,
          leaderboardData: action.payload,
        };
      default:
        throw new Error();
    }
  }, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export { GameContext, GameContextProvider };
