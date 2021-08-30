import { calcTileType } from '../src/js/utils';

test('top-left', () => {
  const inputIndex = 0;
  const inputBoardSize = 8;
  const expected = 'top-left';
  const received = calcTileType(inputIndex, inputBoardSize);
  expect(received).toBe(expected);
});

test('top', () => {
  const inputIndex = 4;
  const inputBoardSize = 10;
  const expected = 'top';
  const received = calcTileType(inputIndex, inputBoardSize);
  expect(received).toBe(expected);
});

test('top-right', () => {
  const inputIndex = 7;
  const inputBoardSize = 8;
  const expected = 'top-right';
  const received = calcTileType(inputIndex, inputBoardSize);
  expect(received).toBe(expected);
});

test('bottom-left', () => {
  const inputIndex = 90;
  const inputBoardSize = 10;
  const expected = 'bottom-left';
  const received = calcTileType(inputIndex, inputBoardSize);
  expect(received).toBe(expected);
});

test('bottom-right', () => {
  const inputIndex = 24;
  const inputBoardSize = 5;
  const expected = 'bottom-right';
  const received = calcTileType(inputIndex, inputBoardSize);
  expect(received).toBe(expected);
});

test('left', () => {
  const inputIndex = 15;
  const inputBoardSize = 5;
  const expected = 'left';
  const received = calcTileType(inputIndex, inputBoardSize);
  expect(received).toBe(expected);
});

test('right', () => {
  const inputIndex = 14;
  const inputBoardSize = 5;
  const expected = 'right';
  const received = calcTileType(inputIndex, inputBoardSize);
  expect(received).toBe(expected);
});

test('bottom', () => {
  const inputIndex = 22;
  const inputBoardSize = 5;
  const expected = 'bottom';
  const received = calcTileType(inputIndex, inputBoardSize);
  expect(received).toBe(expected);
});

test('center', () => {
  const inputIndex = 13;
  const inputBoardSize = 8;
  const expected = 'center';
  const received = calcTileType(inputIndex, inputBoardSize);
  expect(received).toBe(expected);
});
