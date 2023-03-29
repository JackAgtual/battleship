export default function DomController() {
    const _gridSize = 10

    const init = () => {
        const root = document.getElementById('root')
        const gameboardContainer = document.createElement('div')
        gameboardContainer.id = 'gamebaord-container'
        const grid = document.createElement('div')
        grid.classList.add('gameboard')

        for (let i = 0; i < _gridSize; i++) {
            for (let j = 0; j < _gridSize; j++) {
                const gridElement = document.createElement('div')
                gridElement.classList.add('grid-element')
                grid.appendChild(gridElement)
            }
        }
        grid.id = 'player-grid'
        gameboardContainer.append(grid)
        const enemyGrid = grid.cloneNode(true)
        enemyGrid.id = 'enemy-grid'
        gameboardContainer.append(enemyGrid)
        root.append(gameboardContainer)
    }

    return {
        init,
    }
}