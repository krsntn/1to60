import React, { useContext } from 'react';
import { TimeContext } from '../../stores/timeContext';

const Timer = () => {
  const timeContext = useContext(TimeContext);
  const {
    state: { time },
  } = timeContext;

  return (
    <div className="container" style={{ maxWidth: '400px' }}>
      <div className="text-center" style={{ fontSize: '50px' }}>
        {(time / 1000).toFixed(2)}
      </div>
    </div>
  );
};

export default Timer;
