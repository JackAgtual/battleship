function Player(Gameboard) {

    const attackCoordinate = coordinate => Gameboard.receiveAttack({ attackCoordinate: coordinate })

    const attackRandomCoordinate = () => Gameboard.getGameboardSize(_getRandomCoordinate())

    const _getRandomCoordinate = () => {
        const gridSize = Gameboard.getGameboardSize()
        return [
            Math.floor(Math.random() * gridSize),
            Math.floor(Math.random() * gridSize)
        ]
    }

    return {
        attackCoordinate,
        attackRandomCoordinate
    }
}

module.exports = Player