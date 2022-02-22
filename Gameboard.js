import React, { useState, useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import styles from './style/style';
import style from './style/style';

export default function Gameboard() {

  const NBR_OF_DICES = 5;
  const NBR_OF_THROWS = 3;

  const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
  const [sum, setSum] = useState(0);
  const [status, setStatus] = useState('');
  const [board, setBoard] = useState([]);
  const [selectedDices, setSelectedDices] =
    useState(new Array(NBR_OF_DICES).fill(false));
  const [selectedPoints, setSelectedPoints] =
    useState(new Array(6).fill(false));
  const [pointsArray, setPointsArray] = useState(new Array(6).fill(0));
  const [selectedSumValue, setSelectedSumValue] = useState(0);
  const [valueArray, setValueArray] = useState([]);
  const [ptsLeft, setPtsLeft] = useState(63);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    checkBonusPoints();

    if (nbrOfThrowsLeft < 0) {
      setNbrOfThrowsLeft(NBR_OF_THROWS - 1);
    }

  }, [nbrOfThrowsLeft]);

  const throwDices = () => {
    let sum = 0;
    let dices = [];

    if (nbrOfThrowsLeft === 0) {
      setStatus("Select your points before next throw.");
    } else {
      for (let i = 0; i < NBR_OF_DICES; i++) {
        if (!selectedDices[i]) {
          let rndNum = Math.floor(Math.random() * 6 + 1);
          dices[i] = 'dice-' + rndNum;
          sum += rndNum;
        } else {
          dices[i] = board[i];
        }
      }
      setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);
      setSum(sum);
      setBoard(dices);
    }

    if (selectedPoints.every(v => v === true)) {
      resetGame();
    }
  };

  const checkBonusPoints = () => {
    if (nbrOfThrowsLeft === 0) {
      setStatus("Select your points.");
    }
    else {
      setStatus("Throw dices.");
    }

    if (selectedPoints.every(v => v === true)) {
      setStatus("Game over. All points selected.");
    }
  };

  const getDiceColor = (i) => {
    if (board.every((val, i, arr) => val === arr[0])) {
      return "orange";
    }
    else {
      return selectedDices[i] ? "black" : "forestgreen";
    }
  };

  const selectDice = (i) => {
    if (nbrOfThrowsLeft != 3) {
      let dices = [...selectedDices];
      dices[i] = selectedDices[i] ? false : true;

      setSelectedDices(dices);

      let diceValue = Number(board[i].charAt(board[i].length - 1));

      setValueArray(valueArray => [...valueArray, diceValue]);

      dices[i] ? setSelectedSumValue(selectedSumValue + diceValue) : setSelectedSumValue(selectedSumValue - diceValue);
    } else {
      setStatus("You must throw dices first.");
    }
  };

  const getPointsColor = (i) => {
    return selectedPoints[i] ? "black" : "forestgreen";
  }

  const selectPoints = (i) => {
    let points = [...selectedPoints];
    points[i] = selectedPoints[i] ? false : true;
    if (nbrOfThrowsLeft > 0) {
      setStatus("Throw 3 times before setting points.");
    } else {
      if (!selectedPoints[i]) {
        setSelectedPoints(points);
        pointsArray[i] = selectedSumValue;
        resetTurn();
      } else {
        setStatus("You have already selected points for this number.")
      }
    }

    const sumOfPoints = pointsArray.reduce((partialSum, a) => partialSum + a, 0);

    setTotalPoints(sumOfPoints);
    setPtsLeft(ptsLeft - selectedSumValue);
  };

  const resetTurn = () => {
    setStatus("Throw dices");
    setNbrOfThrowsLeft(3);
    setSelectedSumValue(0);
    setSelectedDices(Array(NBR_OF_DICES).fill(false));
  };

  const resetGame = () => {
    setStatus("Throw dices.");
    setNbrOfThrowsLeft(2);
    setSelectedSumValue(0);
    setSelectedDices(Array(NBR_OF_DICES).fill(false));
    setSelectedPoints(Array(6).fill(false));
    setPointsArray(Array(6).fill(0));
    setPtsLeft(63);
    setTotalPoints(0);
  };

  const row = [];

  for (let i = 0; i < NBR_OF_DICES; i++) {
    row.push(
      <Pressable
        key={"row" + i}
        onPress={() => selectDice(i)}>
        <MaterialCommunityIcons
          name={board[i]}
          key={"row" + i}
          size={50}
          color={getDiceColor(i)}>
        </MaterialCommunityIcons>
      </Pressable>
    );
  };

  const points = ["numeric-1-circle", "numeric-2-circle", "numeric-3-circle", "numeric-4-circle", "numeric-5-circle", "numeric-6-circle"]
  const pointsRow = [];

  for (let i = 0; i < 6; i++) {
    pointsRow.push(
      <View key={i}>
        <Text style={style.pointText}>{pointsArray[i]}</Text>
        <Pressable
          key={"pointsRow" + i}
          onPress={() => selectPoints(i)}>
          <MaterialCommunityIcons
            name={points[i]}
            key={"row" + i}
            size={50}
            color={getPointsColor(i)}>
          </MaterialCommunityIcons>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.gameboard}>
      <View style={styles.flex}>{row}</View>

      <Text style={styles.gameinfo}>Throws left: {nbrOfThrowsLeft}</Text>
      <Text style={styles.gameinfo}>{status}</Text>
      <Pressable style={styles.button}
        onPress={() => throwDices()}>
        <Text style={styles.buttonText}>
          Throw dices
        </Text>
      </Pressable>
      <Text style={styles.total}>Total: {totalPoints}</Text>
      {ptsLeft <= 0
        ? <Text>You won the bonus!</Text>
        : <Text>You are {ptsLeft} points away from bonus</Text>
      }
      <View style={styles.flex}>{pointsRow}</View>
    </View>
  );
}
