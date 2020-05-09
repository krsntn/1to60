import React from 'react';
import { GameContextProvider } from './gameContext';
import { TimeContextProvider } from './timeContext';
import { LeaderboardContextProvider } from './leaderboardContext';

const Stores = ({ children }) => {
  return (
    <GameContextProvider>
      <LeaderboardContextProvider>
        <TimeContextProvider>{children}</TimeContextProvider>
      </LeaderboardContextProvider>
    </GameContextProvider>
  );
};

export default Stores;
