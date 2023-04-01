export default function DomController() {
    const _gridSize = 10
    const _sipPlacementHtmlClasses = {
        valid: 'valid-ship-placement',
        invalid: 'invalid-ship-placement',
        placed: 'ship-placed'
    }

    const mockShip = {
        getLength: () => 4
    }
    const _shipOrientation = 'right' // 'up' or 'right'

    const init = Gameboard => {
        const root = document.getElementById('root')
        const gameboardContainer = document.createElement('div')
        gameboardContainer.id = 'gamebaord-container'

        gameboardContainer.append(_getTitleAndGrid('player'))
        gameboardContainer.append(_getTitleAndGrid('computer'))

        root.append(gameboardContainer)

        _startGameModalInit(Gameboard)
    }

    const _generateGrid = gridName => {
        const grid = document.createElement('div')
        grid.classList.add('gameboard-grid')
        grid.id = `${gridName}-grid`

        for (let i = 0; i < _gridSize; i++) {
            for (let j = 0; j < _gridSize; j++) {
                const gridElement = document.createElement('div')
                gridElement.dataset.row = i
                gridElement.dataset.col = j
                gridElement.classList.add('grid-element')
                grid.appendChild(gridElement)
            }
        }
        return grid
    }

    const _generateGridTitle = gridName => {
        const gridTitle = document.createElement('div')
        gridTitle.classList.add('grid-title')
        gridTitle.innerText = gridName.toUpperCase()
        return gridTitle
    }

    const _getTitleAndGrid = gridName => {
        const grid = _generateGrid(gridName)
        const gridTitle = _generateGridTitle(gridName)

        // grid and title
        const gridAndTitle = document.createElement('div')
        gridAndTitle.classList.add('grid-and-title')
        gridAndTitle.append(gridTitle)
        gridAndTitle.append(grid)
        return gridAndTitle
    }

    const _startGameModalInit = Gameboard => {
        const modal = document.getElementById('place-ships')
        const laydownGrid = _generateGrid('laydown')
        laydownGrid.childNodes
            .forEach(gridElement => {
                gridElement.addEventListener('mouseover', () => _showShipPlacement(Gameboard, gridElement, mockShip, _shipOrientation))
                gridElement.addEventListener('mouseleave', () => _showShipPlacement(Gameboard, gridElement, mockShip, _shipOrientation))
                gridElement.addEventListener('click', () => _placePlayerShip(Gameboard, gridElement, mockShip, _shipOrientation))
            }
            )

        modal.append(laydownGrid)

        const startGameBtn = document.getElementById('start-game')
        startGameBtn.addEventListener('click', () => {
            modal.showModal()
        })
    }

    const _getLaydownGridElementAtCoordinate = coordinate => document
        .querySelector(`#laydown-grid > [data-row="${coordinate[0]}"][data-col="${coordinate[1]}"]`)

    const _showShipPlacement = (Gameboard, gridElement, ship, shipOrientation) => {
        const shipLength = ship.getLength()

        const startRow = Number(gridElement.dataset.row)
        const startCol = Number(gridElement.dataset.col)

        const shipPlacementIsValid = Gameboard.shipPlacementIsValid({
            ship,
            origin: [startRow, startCol],
            direction: shipOrientation
        })

        const shipPlacementHtmlClass = shipPlacementIsValid ?
            _sipPlacementHtmlClasses.valid : _sipPlacementHtmlClasses.invalid

        // Assuming only up and right orientations for the ship
        for (let i = 0; i < shipLength; i++) {
            let targetRow, targetCol

            if (shipOrientation === 'up') {
                targetRow = startRow - i
                targetCol = startCol
            } else {
                targetRow = startRow
                targetCol = startCol + i
            }
            const curElement = _getLaydownGridElementAtCoordinate([targetRow, targetCol])

            if (!curElement) break // out of bounds

            if (curElement.classList.contains(_sipPlacementHtmlClasses.placed)) continue // ship is already placed there

            curElement.classList.toggle(shipPlacementHtmlClass)
        }
    }

    const _placePlayerShip = (Gameboard, gridElement, ship, shipOrientation) => {
        const startRow = Number(gridElement.dataset.row)
        const startCol = Number(gridElement.dataset.col)

        const shipCoordinates = Gameboard.shipPlacementIsValid({
            ship,
            origin: [startRow, startCol],
            direction: shipOrientation
        })

        if (!shipCoordinates) return

        Gameboard.placeShip({
            ship,
            origin: [startRow, startCol],
            direction: shipOrientation
        })

        shipCoordinates.forEach(coordinate => {
            const gridElement = _getLaydownGridElementAtCoordinate(coordinate)
            gridElement.classList.add(_sipPlacementHtmlClasses.placed)
            gridElement.classList.remove(_sipPlacementHtmlClasses.valid)
            gridElement.classList.remove(_sipPlacementHtmlClasses.invalid)
        })
    }

    return {
        init,
    }
}