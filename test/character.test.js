import Character from '../src/js/Character';

test('new Character', () => {
  expect(() => {
    new Character();
  }).toThrow('Необходимо выбрать тип персонажа');
});

test('new Hero', () => {
  class Bowman extends Character {
    constructor(level) {
      super(level);
      this.level = level;
      this.type = 'bowman';
      this.attack = 25;
      this.defence = 25;
      this.distance = 2;
      this.distanceAttack = 2;
    }
  }
  const expected = {
    level: 1,
    health: 50,
    type: 'bowman',
    attack: 25,
    defence: 25,
    distance: 2,
    distanceAttack: 2,
  };
  const received = new Bowman(1);

  expect(received).toEqual(expected);
});
