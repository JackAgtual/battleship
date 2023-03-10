function Gameboard() {
    const _size = 10
    const _grid = Array(_size).fill().map(() => Array(_size).fill(false))

    const _directionIsValid = direction => ['up', 'down', 'left', 'right'].includes(direction.toLowerCase())

    const _shipIsInBounds = (shipLength, origin, direction) => {
        const [row, col] = origin

        if (row >= _size || col >= _size) return false

        switch (direction) {
            case 'up':
                return shipLength <= row + 1
            case 'down':
                return shipLength <= _size - row
            case 'left':
                return shipLength <= col + 1
            case 'right':
                return shipLength <= _size - col
        }
    }

    const placeShip = (ship, origin, direction) => {
        direction = direction.toLowerCase()
        const [row, col] = origin
        const shipLength = ship.getLength()

        if (!_directionIsValid(direction) || !_shipIsInBounds(shipLength, origin, direction)) return null

        for (let i = 0; i < shipLength; i++) {
            switch (direction) {
                case 'up':
                    _grid[row - i][col] = true
                    break
                case 'down':
                    _grid[row + i][col] = true
                    break
                case 'left':
                    _grid[row][col - i] = true
                    break
                case 'right':
                    _grid[row][col + i] = true
                    break
            }
        }
        return _grid
    }

    const receiveAttack = coordinate => {

    }

    return {
        placeShip,
        receiveAttack
    }
}

module.exports = Gameboard