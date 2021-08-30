export function possibleMove(position, distance) {
  const allBoard = [];
  let arrStr = [];
  const boardSize = 8;
  const indexLength = boardSize ** 2;

  for (let i = 0; i < indexLength; i += 1) {
    arrStr.push(i);
    if (arrStr.length === boardSize) {
      allBoard.push(arrStr);
      arrStr = [];
    }
  }

  const indexX = Math.floor(position / boardSize);
  const indexY = position % boardSize;
  const possibleIndex = [];

  for (let i = 1; i <= distance; i += 1) {
    let possibleY = indexY + i;

    if (possibleY < boardSize) {
      possibleIndex.push(allBoard[indexX][possibleY]);
    }

    let possibleX = indexX + i;

    if (possibleX < boardSize) {
      possibleIndex.push(allBoard[possibleX][indexY]);
    }
    if ((possibleY < boardSize) && (possibleX < boardSize)) {
      possibleIndex.push(allBoard[possibleX][possibleY]);
    }

    possibleY = indexY - i;
    if (possibleY >= 0) {
      possibleIndex.push(allBoard[indexX][possibleY]);
    }
    if ((possibleY >= 0) && (possibleX < boardSize)) {
      possibleIndex.push(allBoard[possibleX][possibleY]);
    }

    possibleX = indexX - i;
    if (possibleX >= 0) {
      possibleIndex.push(allBoard[possibleX][indexY]);
    }
    if ((possibleY >= 0) && (possibleX >= 0)) {
      possibleIndex.push(allBoard[possibleX][possibleY]);
    }

    possibleY = indexY + i;
    if ((possibleY < boardSize) && (possibleX >= 0)) {
      possibleIndex.push(allBoard[possibleX][possibleY]);
    }
  }

  possibleIndex.sort((a, b) => a - b);
  return possibleIndex;
}

export function possibleAttack(position, distance) {
  const allBoard = [];
  let arrStr = [];
  const boardSize = 8;
  const indexLength = boardSize ** 2;

  for (let i = 0; i < indexLength; i += 1) {
    arrStr.push(i);
    if (arrStr.length === boardSize) {
      allBoard.push(arrStr);
      arrStr = [];
    }
  }

  const indexX = Math.floor(position / boardSize);
  const indexY = position % boardSize;
  const possibleAttackIndex = [];
  let left = indexY - distance;

  if (left < 0) {
    left = 0;
  }
  let top = indexX - distance;
  if (top < 0) {
    top = 0;
  }
  let right = indexY + distance;
  if (right > boardSize - 1) {
    right = boardSize - 1;
  }
  let bottom = indexX + distance;
  if (bottom > boardSize - 1) {
    bottom = boardSize - 1;
  }

  for (let i = top; i <= bottom; i += 1) {
    for (let j = left; j <= right; j += 1) {
      possibleAttackIndex.push(allBoard[i][j]);
    }
  }

  possibleAttackIndex.sort((a, b) => a - b);
  return possibleAttackIndex.filter((item) => item !== position);
}
