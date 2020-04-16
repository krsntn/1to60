import React, { useState, useEffect } from 'react';
import css from './gameTable.module.scss';

const generateArray = (startNum, totalSize) => {
  const array = [];
  for (var i = 0, num = startNum; i < totalSize; i++, startNum++) {
    array[i] = startNum;
  }
  array.sort(() => Math.random() - 0.5);

  return array;
};

const GameTable = (props) => {
  const { updateCurrentNumber, currentNumber, freeze } = props;
  const [firstArray, setFirstArray] = useState([]);
  const [secondArray, setSecondArray] = useState([]);
  const [thirdArray, setThirdArray] = useState([]);

  useEffect(() => {
    setFirstArray(generateArray(1, 20));
    setSecondArray(generateArray(21, 20));
    setThirdArray(generateArray(41, 20));
  }, []);

  const createRow = () => {
    const rows = [];
    for (let i = 0; i < 4; i++) {
      rows.push(<tr key={i}>{createColumns(i)}</tr>);
    }
    return rows;
  };

  const onClick = (selectedNumber) => {
    const newArray = [...firstArray];
    const index = firstArray.indexOf(selectedNumber);
    const nextAppearNumber = currentNumber + 20;

    if (thirdArray.indexOf(nextAppearNumber) >= 0) {
      newArray[index] = thirdArray[index];
    } else if (secondArray.indexOf(nextAppearNumber) >= 0) {
      newArray[index] = secondArray[index];
    } else {
      newArray[index] = '';
    }
    setFirstArray(newArray);

    updateCurrentNumber(selectedNumber);
  };

  const createColumns = (row) => {
    const columns = [];
    for (let j = row * 5; j < row * 5 + 5; j++) {
      columns.push(
        <td
          key={j}
          className={css.column}
          onClick={() =>
            firstArray[j] === '' || freeze ? null : onClick(firstArray[j])
          }
        >
          {firstArray[j] !== '' && (
            <button
              type="button"
              className={`${css.button} btn ${
                freeze && firstArray[j] === currentNumber ? 'btn-danger' : ''
              } ${
                freeze && firstArray[j] !== currentNumber ? 'btn-dark' : ''
              } ${!freeze ? 'btn-primary' : ''} btn-block`}
            >
              {firstArray[j]}
            </button>
          )}
        </td>
      );
    }
    return columns;
  };

  return (
    <table className={css.table}>
      <tbody>{createRow()}</tbody>
    </table>
  );
};

export default GameTable;
