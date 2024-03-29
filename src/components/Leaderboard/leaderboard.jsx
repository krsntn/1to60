import React, { useContext } from 'react';
import css from './leaderboard.module.scss';
import { LeaderboardContext } from '../../stores/leaderboardContext';

const Leaderboard = (props) => {
  const leaderboardContext = useContext(LeaderboardContext);
  const { data } = leaderboardContext.state;

  const createRow = () => {
    let rows = [];
    if (data.length > 0) {
      rows = data.map((record, index) => {
        return (
          <tr key={index}>
            <th scope="row" className="pb-2">
              {index + 1}
            </th>
            <td>
              <div className={css.name} data-name={record.name}>
                {record.name}
              </div>
            </td>
            <td className={`text-primary`}>
              {parseFloat(record.speed).toFixed(2)}
            </td>
          </tr>
        );
      });
    } else {
      rows.push(
        <tr key={1} className={css.emptyRow}>
          <th scope="row" colSpan="100%">
            <div className={css.lds_ellipsis}>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </th>
        </tr>
      );
    }
    return rows;
  };

  return (
    <div className={css.leaderboardContainer}>
      Leaderboard
      <table className={`${css.table} table table-borderless`}>
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Name</th>
            <th scope="col">Speed</th>
          </tr>
        </thead>
        <tbody>{createRow()}</tbody>
      </table>
    </div>
  );
};

export default React.memo(Leaderboard);
