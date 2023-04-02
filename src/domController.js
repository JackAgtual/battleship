export default function DomController() {
    const _gridSize = 10
    const _sipPlacementHtmlClasses = {
        valid: 'valid-ship-placement',
        invalid: 'invalid-ship-placement',
        placed: 'ship-placed'
    }
    let _shipOrientation = { orientation: 'right' } // using obj so it can be passed by reference
    let _curShipIdx
    let _curShip
    let _availableShips

    const init = Gameboard => {
        const root = document.getElementById('root')
        const gameboardContainer = document.createElement('div')
        gameboardContainer.id = 'gamebaord-container'

        gameboardContainer.append(_getTitleAndGrid('player'))
        gameboardContainer.append(_getTitleAndGrid('computer'))

        root.append(gameboardContainer)

        _availableShips = Gameboard.getAvailableShips();
        _updateCurrentShip()

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

        // laydown grid
        const laydownGrid = _generateGrid('laydown')
        laydownGrid.childNodes
            .forEach(gridElement => {
                gridElement.addEventListener('mouseover', () => _showShipPlacement(Gameboard, gridElement, _curShip, _shipOrientation))
                gridElement.addEventListener('mouseleave', () => _showShipPlacement(Gameboard, gridElement, _curShip, _shipOrientation))
                gridElement.addEventListener('click', () => _placePlayerShip(Gameboard, gridElement, _curShip, _shipOrientation))
            }
            )
        modal.append(laydownGrid)

        // rotate ships
        document.getElementById('rotate-ship').addEventListener('click', () => {
            if (_shipOrientation.orientation === 'right') _shipOrientation.orientation = 'up'
            else _shipOrientation.orientation = 'right'
        })

        // start game
        const startGameBtn = document.getElementById('start-game')
        startGameBtn.addEventListener('click', () => {
            modal.showModal()
        })
    }

    const _getLaydownGridElementAtCoordinate = coordinate => document
        .querySelector(`#laydown-grid > [data-row="${coordinate[0]}"][data-col="${coordinate[1]}"]`)

    const _showShipPlacement = (Gameboard, gridElement, ship, shipOrientation) => {
        const shipLength = ship.getLength()
        const orientation = shipOrientation.orientation

        const startRow = Number(gridElement.dataset.row)
        const startCol = Number(gridElement.dataset.col)

        const shipPlacementIsValid = Gameboard.shipPlacementIsValid({
            ship,
            origin: [startRow, startCol],
            direction: orientation
        })

        const shipPlacementHtmlClass = shipPlacementIsValid ?
            _sipPlacementHtmlClasses.valid : _sipPlacementHtmlClasses.invalid

        // Assuming only up and right orientations for the ship
        for (let i = 0; i < shipLength; i++) {
            let targetRow, targetCol

            if (orientation === 'up') {
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
        const orientation = shipOrientation.orientation

        const shipCoordinates = Gameboard.shipPlacementIsValid({
            ship,
            origin: [startRow, startCol],
            direction: orientation
        })

        if (!shipCoordinates) return

        Gameboard.placeShip({
            ship,
            origin: [startRow, startCol],
            direction: orientation
        })

        shipCoordinates.forEach(coordinate => {
            const gridElement = _getLaydownGridElementAtCoordinate(coordinate)
            gridElement.classList.add(_sipPlacementHtmlClasses.placed)
            gridElement.classList.remove(_sipPlacementHtmlClasses.valid)
            gridElement.classList.remove(_sipPlacementHtmlClasses.invalid)
        })
        _updateCurrentShip()
    }

    const _updateCurrentShip = () => {
        _curShipIdx = _curShipIdx || _curShipIdx === 0 ? _curShipIdx + 1 : 0
        _curShip = _availableShips[_curShipIdx].ship
    }

    return {
        init,
    }
}