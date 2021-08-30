import { generateTeam } from './generators';
import Bowman from './Classes/Bowman';
import Daemon from './Classes/Daemon';
import Magician from './Classes/Magician';
import Swordsman from './Classes/Swordsman';
import Undead from './Classes/Undead';
import Vampire from './Classes/Vampire';
import themes from './themes';
import PositionedCharacter from './PositionedCharacter';
import cursors from './cursors';
import GamePlay from './GamePlay';
import GameState from './GameState';
import { possibleAttack, possibleMove } from './actions';

const userPositionDefault = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
const enemyPositionDefault = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
const userTypes = [Bowman, Swordsman, Magician];
const enemyTypes = [Daemon, Undead, Vampire];
const user = ['bowman', 'swordsman', 'magician'];
const enemy = ['daemon', 'undead', 'vampire'];
let teamUser = generateTeam(userTypes, 1, 2);
let teamEnemy = generateTeam(enemyTypes, 1, 2);

function getCharacterPosition(max, arr, side) {
  while (arr.length <= max) {
    const random = Math.floor(Math.random() * side.length);
    const result = side[random];
    if (!arr.includes(result)) {
      return result;
    }
  }
}

function infoMessage(hero) {
  const levelIcon = String.fromCodePoint(0x1F396);
  const attackIcon = String.fromCodePoint(0x2694);
  const defenceIcon = String.fromCodePoint(0x1F6E1);
  const healthIcon = String.fromCodePoint(0x2764);

  const info = `${levelIcon} ${hero.level} ${attackIcon} ${hero.attack} ${defenceIcon} ${hero.defence} ${healthIcon} ${hero.health}`;

  return info;
}

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.activePlayer = 'user';
    this.selected = '';
    this.level = 1;
    this.playersTeam = 2;
    this.characterAdded = 2;
    this.userPositionedTeam = [];
    this.enemyPositionedTeam = [];
    this.score = 0;
    this.lock = false;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.prairie);
    this.onNewGame();
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addNewGameListener(this.onNewGame.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGame.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGame.bind(this));
  }

  onNewGame() {
    this.level = 1;
    this.activePlayer = 'user';
    this.selected = '';
    this.userPositionedTeam = [];
    this.enemyPositionedTeam = [];
    teamUser = generateTeam(userTypes, 1, 2);
    teamEnemy = generateTeam(enemyTypes, 1, 2);
    this.score = 0;
    this.lock = false;
    this.initTeam(teamUser, this.userPositionedTeam, userPositionDefault);
    this.initTeam(teamEnemy, this.enemyPositionedTeam, enemyPositionDefault);
    this.gamePlay.drawUi(themes.prairie);
    this.positions = this.userPositionedTeam.concat(this.enemyPositionedTeam);
    this.gamePlay.redrawPositions(this.positions);
  }

  onSaveGame() {
    const status = {
      level: this.level,
      activePlayer: this.activePlayer,
      selected: this.selected,
      userPositionedTeam: this.userPositionedTeam,
      enemyPositionedTeam: this.enemyPositionedTeam,
      score: this.score,
    };
    this.stateService.save(GameState.from(status));
    alert('Игра сохранена');
  }

  onLoadGame() {
    const load = this.stateService.load();
    if (load) {
      this.level = load.level;
      this.activePlayer = load.activePlayer;
      this.themes = load.themes;
      this.score = load.score;
      this.selected = load.selected;
      this.userPositionedTeam = load.userPositionedTeam;
      this.enemyPositionedTeam = load.enemyPositionedTeam;
    }
    let theme;
    if (this.level === 1) {
      theme = themes.prairie;
    } else if (this.level === 2) {
      theme = themes.desert;
    } else if (this.level === 3) {
      theme = themes.arctic;
    } else if (this.level === 4) {
      theme = themes.mountain;
    }
    this.gamePlay.drawUi(theme);
    this.positions = this.userPositionedTeam.concat(this.enemyPositionedTeam);
    this.gamePlay.redrawPositions(this.positions);
    this.gamePlay.selectCell(this.selected.position);
  }

  initTeam(teamSide, teamPositionSide, sidePositionDefault) {
    teamSide.forEach((character) => {
      const checkArr = teamPositionSide.map(item => item.position);
      const index = getCharacterPosition(teamSide.length, checkArr, sidePositionDefault);
      const positionedCharacter = new PositionedCharacter(character, index);
      teamPositionSide = teamPositionSide.concat(positionedCharacter);
    });
    if (sidePositionDefault === userPositionDefault) {
      this.userPositionedTeam = teamPositionSide;
      return this.userPositionedTeam;
    } else if (sidePositionDefault === enemyPositionDefault) {
      this.enemyPositionedTeam = teamPositionSide;
      return this.enemyPositionedTeam;
    }
  }


  onCellClick(index) {
    // TODO: react to click
    if (!this.lock) {
      const selectedHero = this.positions.filter((i) => i.position === index);

      if (selectedHero[0] !== undefined && user.includes(selectedHero[0].character.type)) {
        if (this.selected) {
          this.gamePlay.deselectCell(this.selected.position);
        }
        this.gamePlay.selectCell(index);
        this.selected = selectedHero[0];
        this.attackIndex = possibleAttack(this.selected.position, this.selected.character.distanceAttack);
        this.moveIndex = possibleMove(this.selected.position, this.selected.character.distance);
      } else if (this.selected) {
        if (this.attackIndex.includes(index) && selectedHero.length && enemy.includes(selectedHero[0].character.type)) {
          const target = this.enemyPositionedTeam.filter((item) => item.position === index);

          this.attack(index, this.selected.character, target[0].character);
          this.gamePlay.deselectCell(this.selected.position);
          this.selected = '';
        } else if (this.moveIndex.includes(index)) {
          if (this.activePlayer !== 'user') {
            this.enemyAction();
          }
          this.gamePlay.deselectCell(this.selected.position);
          this.selected.position = index;
          this.positions = this.userPositionedTeam.concat(this.enemyPositionedTeam);
          this.gamePlay.redrawPositions(this.positions);
          this.gamePlay.selectCell(index);
          this.activePlayer = 'enemy';
          this.gamePlay.deselectCell(this.selected.position);
          this.selected = '';
          this.enemyAction();
        } else {
          GamePlay.showError('Недопустимое действие');
        }
      }
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const selectedHero = this.positions.filter((i) => i.position === index);

    if (selectedHero[0] !== undefined) {
      const shortInfo = infoMessage(selectedHero[0].character);

      this.gamePlay.showCellTooltip(shortInfo, index);
      for (const i of this.positions) {
        if (i.position === index && user.includes(selectedHero[0].character.type)) {
          this.gamePlay.setCursor(cursors.pointer);
        } else if (i.position === index && enemy.includes(selectedHero[0].character.type)) {
          this.gamePlay.setCursor(cursors.notallowed);
        }
      }
    }
    if (this.selected && this.moveIndex.includes(index) && !selectedHero.length) {
      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.selectCell(index, 'green');
    } else if (this.selected && this.attackIndex.includes(index) && selectedHero.length && enemy.includes(selectedHero[0].character.type)) {
      this.gamePlay.setCursor(cursors.crosshair);
      this.gamePlay.selectCell(index, 'red');
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    if (this.selected.position !== index) {
      this.gamePlay.deselectCell(index);
    }
    this.gamePlay.setCursor(cursors.auto);
    this.gamePlay.hideCellTooltip(index);
  }

  attack(index, attacker, target) {
    const damage = Math.round(Math.max(attacker.attack - target.defence, attacker.attack * 0.1));

    target.health -= damage;
    this.gamePlay.showDamage(index, damage).then(() => {
      this.gamePlay.redrawPositions(this.positions);
      if (this.activePlayer === 'user') {
        this.activePlayer = 'enemy';
        this.enemyAction();
      } else if (this.activePlayer === 'enemy') {
        this.activePlayer = 'user';
      }
    });
    if (target.health - damage <= 0) {
      this.gamePlay.deselectCell(index);
      this.enemyPositionedTeam = this.enemyPositionedTeam.filter((item) => item.position !== index);
      this.userPositionedTeam = this.userPositionedTeam.filter((item) => item.position !== index);
      this.positions = this.userPositionedTeam.concat(this.enemyPositionedTeam);
      this.gamePlay.redrawPositions(this.positions);
      if (this.userPositionedTeam.length === 0) {
        this.lock = true;
        alert('Игра окончена');
      } else if (this.enemyPositionedTeam.length === 0) {
        this.selected = '';
        this.userPositionedTeam.forEach((item) => {
          this.score += item.character.health;
        });
        this.levelUp();
      }
    }
  }

  enemyAction() {
    const getEnemyChar = () => {
      const random = Math.floor(Math.random() * this.enemyPositionedTeam.length);
      const result = this.enemyPositionedTeam[random];

      return result;
    };

    if (getEnemyChar()) {
      this.enemyAttackIndex = possibleAttack(getEnemyChar().position, getEnemyChar().character.distanceAttack);
      this.enemyMoveIndex = possibleMove(getEnemyChar().position, getEnemyChar().character.distance);

      for (const userPosition of this.userPositionedTeam) {
        const attackCellKey = this.enemyAttackIndex.indexOf(userPosition.position);

        if (attackCellKey !== -1) {
          const attackCell = this.enemyAttackIndex[attackCellKey];
          this.attack(attackCell, getEnemyChar().character, userPosition.character);

          return;
        }
        this.newPos = possibleMove(getEnemyChar().position, getEnemyChar().character.distance);
        this.positions = this.userPositionedTeam.concat(this.enemyPositionedTeam);
        const busyIndexes = this.positions.map((item) => item.position);
        const vacantIndexes = this.newPos.filter((item) => busyIndexes.indexOf(item) === -1);
        const getEnemyPosition = () => {
          const random = Math.floor(Math.random() * vacantIndexes.length);
          const result = vacantIndexes[random];

          return result;
        };

        getEnemyChar().position = getEnemyPosition();
        this.positions = this.userPositionedTeam.concat(this.enemyPositionedTeam);
        this.gamePlay.redrawPositions(this.positions);
        this.activePlayer = 'user';

        return;
      }
    }
  }

  levelUpHero(arr) {
    arr.forEach((item) => {
      item.character.level += 1;
      const ratio = (1.8 - item.character.health / 100);
      const attackAfter = Math.max(item.character.attack, item.character.attack * ratio);
      const defenceAfter = Math.max(item.character.defence, item.character.defence * ratio);

      item.character.attack = Math.floor(attackAfter);
      item.character.defence = Math.floor(defenceAfter);
      item.character.health += 80;

      if (item.character.health >= 100) {
        item.character.health = 100;
      }
    });
  }

  levelUp() {
    const lastDigit = this.score.toString().slice(-1);
    let textScore = '';

    if (lastDigit === 1) {
      textScore = 'очко';
    } else if (lastDigit > 1 && lastDigit < 5) {
      textScore = 'очка';
    } else {
      textScore = 'очков';
    }

    this.level += 1;
    if (this.level > 4) {
      alert(`Победа! Все уровни пройдены! Вы набрали ${this.score} ${textScore}`);
      this.lock = true;
    } else {
      alert(`Переход на ${this.level} уровень. Вы набрали ${this.score} ${textScore}`);
    }

    let theme;
    if (this.level === 1) {
      theme = themes.prairie;
      this.characterAdded = 2;
    } else if (this.level === 2) {
      theme = themes.desert;
      this.characterAdded = 1;
    } else if (this.level === 3) {
      theme = themes.arctic;
      this.characterAdded = 2;
    } else if (this.level === 4) {
      theme = themes.mountain;
      this.characterAdded = 2;
    }

    if (!this.lock) {
      this.gamePlay.drawUi(theme);

      this.levelUpHero(this.userPositionedTeam);

      const updTeamUser = generateTeam(userTypes, this.level - 1, this.characterAdded);

      updTeamUser.forEach((character) => {
        const checkArr = this.userPositionedTeam.map((item) => item.position);
        const updPosition = getCharacterPosition(this.userPositionedTeam.length, checkArr, userPositionDefault);
        const positionedCharacter = new PositionedCharacter(character, updPosition);
        this.userPositionedTeam.push(positionedCharacter);
      });

      const updTeamEnemy = generateTeam(enemyTypes, this.level, this.userPositionedTeam.length);

      updTeamEnemy.forEach((character) => {
        const checkArr = this.enemyPositionedTeam.map((item) => item.position);
        const updPosition = getCharacterPosition(this.enemyPositionedTeam.length, checkArr, enemyPositionDefault);
        const positionedCharacter = new PositionedCharacter(character, updPosition);
        this.enemyPositionedTeam.push(positionedCharacter);
      });

      this.positions = this.userPositionedTeam.concat(this.enemyPositionedTeam);
      this.gamePlay.redrawPositions(this.positions);
    }
  }
}
