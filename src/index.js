import './styles.css';
import DomController from './domController';
import Gameboard from './gameboard';
import GameLoop from './gameLoop';

const playerGameboard = Gameboard()
const computerGameboard = Gameboard()
computerGameboard.randomlyPlaceShips()
const domController = DomController()
domController.init(playerGameboard, computerGameboard)
const gameLoop = GameLoop(playerGameboard, computerGameboard, domController)
gameLoop.startGame()