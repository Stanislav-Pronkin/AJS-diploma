/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  const index = Math.floor(Math.random() * allowedTypes.length);
  const level = Math.floor(Math.random() * maxLevel) + 1;
  const randCharacterClass = allowedTypes[index];
  const returnCharacter = new randCharacterClass(level);

  if (returnCharacter.level > 1) {
    const ratio = (returnCharacter.level - 1) * 0.3 + 1;
    const attackAfter = returnCharacter.attack * ratio;
    const defenceAfter = returnCharacter.defence * ratio;

    returnCharacter.attack = Math.floor(attackAfter);
    returnCharacter.defence = Math.floor(defenceAfter);
  }

  yield returnCharacter;
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const team = [];

  for (let i = 0; i < characterCount; i += 1) {
    const character = characterGenerator(allowedTypes, maxLevel);
    team.push(character.next().value);
  }
  return team;
}
