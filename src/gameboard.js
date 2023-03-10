function Gameboard() {
    const _size = 10
    const _grid = Array(_size).fill().map(() => Array(_size).fill(0))

    const placeShip = (ship, origin, direction) => {

    }

    const receiveAttack = coordinate => {

    }

    return {
        placeShip,
        receiveAttack
    }
}

module.exports = Gameboard