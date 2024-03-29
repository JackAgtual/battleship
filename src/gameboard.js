import _ from 'lodash'
import Ship from './ship'

export default function Gameboard() {
    const _gridSize = 10
    const _shipGrid = Array(_gridSize).fill().map(() => Array(_gridSize).fill(false))
    const _ships = []
    const _missedAttacks = []
    const _hitAttacks = []
    const _availableShips = [
        {
            name: 'Carrier',
            ship: Ship({ length: 5 })
        },
        {
            name: 'Battleship',
            ship: Ship({ length: 4 })
        },
        {
            name: 'Destroyer',
            ship: Ship({ length: 3 })
        },
        {
            name: 'Submarine',
            ship: Ship({ length: 3 })
        },
        {
            name: 'Patrol Boat',
            ship: Ship({ length: 1 })
        },

    ]

    const _directionIsValid = direction => ['up', 'down', 'left', 'right'].includes(direction.toLowerCase())

    const _coordinateIsOutOfBounds = coordinate => {
        const [row, col] = coordinate
        return row >= _gridSize || col >= _gridSize
    }

    const coordinateHasAlreadyBeenAttacked = ({ coordinate, hits = _hitAttacks, misses = _missedAttacks }) => {
        // check hits and misses arrays
        for (let i = 0; i < hits.length; i++) {
            if (_.isEqual(hits[i], coordinate)) return true
        }
        for (let i = 0; i < misses.length; i++) {
            if (_.isEqual(misses[i], coordinate)) return true
        }
        return false
    }

    const _shipIsInBounds = (shipLength, origin, direction) => {
        const [row, col] = origin

        if (_coordinateIsOutOfBounds(origin)) return false

        switch (direction) {
            case 'up':
                return shipLength <= row + 1
            case 'down':
                return shipLength <= _gridSize - row
            case 'left':
                return shipLength <= col + 1
            case 'right':
                return shipLength <= _gridSize - col
        }
    }

    const _getShipCoordinates = ({
        shipLength,
        origin,
        direction
    }) => {
        const [row, col] = origin
        const shipCoordinates = []
        for (let i = 0; i < shipLength; i++) {
            switch (direction) {
                case 'up':
                    shipCoordinates.push([row - i, col])
                    break
                case 'down':
                    shipCoordinates.push([row + i, col])
                    break
                case 'left':
                    shipCoordinates.push([row, col - i])
                    break
                case 'right':
                    shipCoordinates.push([row, col + i])
                    break
            }
        }
        return shipCoordinates
    }

    const _shipOverlapsWithExistingShip = ({ shipCoordinates, shipGrid }) => {
        for (let i = 0; i < shipCoordinates.length; i++) {
            const [row, col] = shipCoordinates[i]
            if (!!shipGrid[row][col]) return true
        }
        return false
    }

    const shipPlacementIsValid = ({ ship, origin, direction, shipGrid = _shipGrid }) => {
        direction = direction.toLowerCase()
        const shipLength = ship.getLength()

        if (!_directionIsValid(direction)) return false
        if (!_shipIsInBounds(shipLength, origin, direction)) return false

        const shipCoordinates = _getShipCoordinates({
            shipLength,
            origin,
            direction
        })

        if (_shipOverlapsWithExistingShip({
            shipCoordinates,
            shipGrid
        })) return false

        return shipCoordinates
    }

    const placeShip = ({ ship, origin, direction, shipGrid = _shipGrid, ships = _ships }) => {
        const shipCoordinates = shipPlacementIsValid({ ship, origin, direction, shipGrid })

        if (!shipCoordinates) return null;

        shipCoordinates.forEach(coordinate => {
            shipGrid[coordinate[0]][coordinate[1]] = ship
        })

        ships.push(ship)

        return [shipGrid, ships]
    }

    const receiveAttack = ({
        attackCoordinate,
        hits = _hitAttacks,
        misses = _missedAttacks,
        shipGrid = _shipGrid
    }) => {
        const [row, col] = attackCoordinate

        if (_coordinateIsOutOfBounds(attackCoordinate)) return null
        if (coordinateHasAlreadyBeenAttacked({
            coordinate: attackCoordinate,
            hits,
            misses
        })) return null

        // record attack
        const ship = shipGrid[row][col]
        if (!!ship) {
            // hit
            ship.hit()
            hits.push(attackCoordinate)
            return true
        }

        // miss
        misses.push(attackCoordinate)
        return false
    }

    const attackRandomCoordinate = () => receiveAttack(
        {
            attackCoordinate: _getRandomCoordinate(),
            hits: _hitAttacks,
            misses: _missedAttacks,
            shipGrid: _shipGrid
        }
    )

    const _getRandomCoordinate = () => {
        const gridSize = _getGameboardSize()
        return [
            Math.floor(Math.random() * gridSize),
            Math.floor(Math.random() * gridSize)
        ]
    }

    const allShipsAreSunk = (shipsOnGameboard = _ships) => {
        if (shipsOnGameboard.length === 0) return false;

        for (let i = 0; i < shipsOnGameboard.length; i++) {
            if (!shipsOnGameboard[i].isSunk()) return false;
        }
        return true
    }

    const _getGameboardSize = () => _gridSize

    const getAvailableShips = () => _availableShips

    const randomlyPlaceShips = () => {
        _availableShips.forEach(shipObj => {
            let randomCoordinate, randomDirection
            do {
                randomCoordinate = [
                    Math.floor(Math.random() * _gridSize),
                    Math.floor(Math.random() * _gridSize)
                ]
                randomDirection = ['up', 'down', 'left', 'right']
                    .at(Math.floor(Math.random() * 4))
            } while (!placeShip({
                ship: shipObj.ship,
                origin: randomCoordinate,
                direction: randomDirection
            }))
        })
    }

    return {
        shipPlacementIsValid,
        placeShip,
        coordinateHasAlreadyBeenAttacked,
        receiveAttack,
        attackRandomCoordinate,
        allShipsAreSunk,
        getAvailableShips,
        randomlyPlaceShips
    }
}