import './styles.css';
import DomController from './domController';
import Gameboard from './gameboard';

const playerGameboard = Gameboard()
const computerGameboard = Gameboard()
computerGameboard.randomlyPlaceShips()
const domController = DomController()
domController.init(playerGameboard, computerGameboard)