export default function DomController() {
    const _gridSize = 10

    const init = () => {
        const root = document.getElementById('root')
        const gameboardContainer = document.createElement('div')
        gameboardContainer.id = 'gamebaord-container'

        gameboardContainer.append(_getTitleAndGrid('player'))
        gameboardContainer.append(_getTitleAndGrid('computer'))

        root.append(gameboardContainer)
    }

    const _getTitleAndGrid = gridName => {

        // grid
        const grid = document.createElement('div')
        grid.classList.add('gameboard-grid')
        grid.id = `${gridName}-grid`

        for (let i = 0; i < _gridSize; i++) {
            for (let j = 0; j < _gridSize; j++) {
                const gridElement = document.createElement('div')
                gridElement.classList.add('grid-element')
                grid.appendChild(gridElement)
            }
        }

        // title
        const gridTitle = document.createElement('div')
        gridTitle.classList.add('grid-title')
        gridTitle.innerText = gridName.toUpperCase()

        // grid and title
        const gridAndTitle = document.createElement('div')
        gridAndTitle.classList.add('grid-and-title')
        gridAndTitle.append(gridTitle)
        gridAndTitle.append(grid)
        return gridAndTitle
    }

    return {
        init,
    }
}