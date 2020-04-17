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

  const createRow = () => {
    let rows = [];
    if (data.length > 0) {
      rows = data.map((record, index) => {
        return (
          <tr key={index}>
            <th scope="row">{index + 1}</th>
            <td>
              <div className={css.name}>{record.name}</div>
              <span className={css.tooltips}>{record.name}</span>
            </td>
            <td>{parseFloat(record.speed).toFixed(2)}</td>
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
        </tr>
      </thead>
      <tbody>{createRow()}</tbody>
    </table>
  );
};

export default Leaderboard;
