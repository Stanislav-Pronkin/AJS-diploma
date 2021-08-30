import { possibleAttack, possibleMove } from '../src/js/actions';

test('possible move', () => {
  const position = 0;
  const distance = 2;
  const expected = [1, 2, 8, 9, 16, 18];
  const received = possibleMove(position, distance);

  expect(received).toEqual(expected);
});

test('possible move', () => {
  const position = 27;
  const distance = 2;
  const expected = [9, 11, 13, 18, 19, 20, 25, 26, 28, 29, 34, 35, 36, 41, 43, 45];
  const received = possibleMove(position, distance);

  expect(received).toEqual(expected);
});

test('possible attack', () => {
  const position = 27;
  const distance = 2;
  const expected = [9, 10, 11, 12, 13, 17, 18, 19, 20, 21, 25, 26, 28, 29, 33, 34, 35, 36, 37, 41, 42, 43, 44, 45];
  const received = possibleAttack(position, distance);

  expect(received).toEqual(expected);
});

test('possible attack', () => {
  const position = 0;
  const distance = 2;
  const expected = [1, 2, 8, 9, 10, 16, 17, 18];
  const received = possibleAttack(position, distance);

  expect(received).toEqual(expected);
});
