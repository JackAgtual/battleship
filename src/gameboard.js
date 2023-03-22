import _ from 'lodash'

function Gameboard() {
    const _gridSize = 10
    const _shipGrid = Array(_gridSize).fill().map(() => Array(_gridSize).fill(false))
    const _ships = []
    const _missedAttacks = []
    const _hitAttacks = []

    const _directionIsValid = direction => ['up', 'down', 'left', 'right'].includes(direction.toLowerCase())

    const _coordinateIsOutOfBounds = coordinate => {
        const [row, col] = coordinate
        return row >= _gridSize || col >= _gridSize
    }

    const _coordinateHasAlreadyBeenAttacked = ({ coordinate, hits = _hitAttacks, misses = _missedAttacks }) => {
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

    const placeShip = ({ ship, origin, direction, shipGrid = _shipGrid, ships = _ships }) => {
        direction = direction.toLowerCase()
        const shipLength = ship.getLength()

        if (!_directionIsValid(direction) || !_shipIsInBounds(shipLength, origin, direction)) return null

        const shipCoordinates = _getShipCoordinates({
            shipLength,
            origin,
            direction
        })

        if (_shipOverlapsWithExistingShip({
            shipCoordinates,
            shipGrid
        })) return null;

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
        if (_coordinateHasAlreadyBeenAttacked({
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
        } else {
            // miss
            misses.push(attackCoordinate)
        }
        return [hits, misses]
    }

    const allShipsAreSunk = (shipsOnGameboard = _ships) => {
        if (shipsOnGameboard.length === 0) return false;

        for (let i = 0; i < shipsOnGameboard.length; i++) {
            if (!shipsOnGameboard[i].isSunk()) return false;
        }
        return true
    }

    const getGameboardSize = () => _gridSize

    return {
        placeShip,
        receiveAttack,
        allShipsAreSunk,
        getGameboardSize
    }
}

module.exports = Gameboard