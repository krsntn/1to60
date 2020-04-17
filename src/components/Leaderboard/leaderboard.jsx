import React, { useState, useEffect } from 'react';
import css from './leaderboard.module.scss';

function errData(err) {
  console.error(err);
}

const Leaderboard = (props) => {
  const { db } = props;
  const [data, setData] = useState([]);

  const gotData = (data) => {
    const localData = [];
    const records = data.val();
    if (records) {
      const keys = Object.keys(records);
      for (const key of keys) {
        localData.push(records[key]);
      }
      const finalOutput = localData.sort((a, b) =>
        a.speed > b.speed ? 1 : -1
      );
      setData(finalOutput);
    }
  };

  useEffect(() => {
    if (db) {
      db.orderByChild('speed')
        .limitToFirst(20)
        .on('value', gotData, errData);
    }
  }, [db]);

  const convertDateTime = (datetime) => {
    if (datetime) {
      const dataTime = new Date(datetime);
      const now = new Date();

      const minsAgo = Math.floor(Math.abs(now - dataTime) / (1000 * 60));

      let output = '';
      if (minsAgo < 1) {
        output = 'few seconds ago';
      } else if (minsAgo < 60) {
        output = `${Math.floor(minsAgo)} min${minsAgo === 1 ? '' : 's'} ago`;
      } else if (minsAgo / 60 < 24) {
        const hour = minsAgo / 60;
        output = `${Math.floor(hour)} hr${hour === 1 ? '' : 's'} ago`;
      } else if (minsAgo / 60 / 24 < 7) {
        const day = minsAgo / 60 / 24;
        output = `${Math.floor(day)} day${day === 1 ? '' : 's'} ago`;
      }
      return output;
    }
  };

  const createRow = () => {
    let rows = [];
    if (data.length > 0) {
      rows = data.map((record, index) => {
        return (
          <tr key={index}>
            <th scope="row">{index + 1}</th>
            <td>
              <div className={css.name}>{record.name}</div>
              {/* <span className={css.tooltips}>{record.name}</span> */}
            </td>
            <td className={`text-primary`}>
              {parseFloat(record.speed).toFixed(2)}
            </td>
            <td className={css.datetime}>{convertDateTime(record.time)}</td>
          </tr>
        );
      });
    } else {
      rows.push(
        <tr key={1} className={css.emptyRow}>
          <th scope="row"></th>
          <td></td>
          <td></td>
        </tr>
      );
    }
    return rows;
  };

  return (
    <table className={`${css.table} table table-borderless`}>
      <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col">Name</th>
          <th scope="col">Speed</th>
          <th scope="col">Time</th>
        </tr>
      </thead>
      <tbody>{createRow()}</tbody>
    </table>
  );
};

export default Leaderboard;
