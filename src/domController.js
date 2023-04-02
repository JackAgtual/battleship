export default function DomController() {
    const _gridSize = 10
    const modal = document.getElementById('place-ships')
    const _sipPlacementHtmlClasses = {
        valid: 'valid-ship-placement',
        invalid: 'invalid-ship-placement',
        placed: 'ship-placed'
    }
    let _shipOrientation = { orientation: 'right' } // using obj so it can be passed by reference
    let _curShipIdx
    let _curShip
    let _availableShips
    const _curShipNameElement = document.getElementById('ship-being-placed')
    const [_laydownGridParentId, _playerGridParentId] = ['laydown-grid', 'player-grid']


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

    const _getCoordinateFromGridElement = gridElement => [
        Number(gridElement.dataset.row),
        Number(gridElement.dataset.col)
    ]

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

    const _getGridElementAtCoordinate = (gridParentId, coordinate) => document
        .querySelector(`#${gridParentId} > [data-row="${coordinate[0]}"][data-col="${coordinate[1]}"]`)

    const _showShipPlacement = (Gameboard, gridElement, ship, shipOrientation) => {
        const shipLength = ship.getLength()
        const orientation = shipOrientation.orientation

        const shipOrigin = _getCoordinateFromGridElement(gridElement)

        const shipPlacementIsValid = Gameboard.shipPlacementIsValid({
            ship,
            origin: shipOrigin,
            direction: orientation
        })

        const shipPlacementHtmlClass = shipPlacementIsValid ?
            _sipPlacementHtmlClasses.valid : _sipPlacementHtmlClasses.invalid

        // Assuming only up and right orientations for the ship
        for (let i = 0; i < shipLength; i++) {
            let targetRow, targetCol

            if (orientation === 'up') {
                targetRow = shipOrigin[0] - i
                targetCol = shipOrigin[1]
            } else {
                targetRow = shipOrigin[0]
                targetCol = shipOrigin[1] + i
            }
            const curElement = _getGridElementAtCoordinate(_laydownGridParentId, [targetRow, targetCol])

            if (!curElement) break // out of bounds

            if (curElement.classList.contains(_sipPlacementHtmlClasses.placed)) continue // ship is already placed there

            curElement.classList.toggle(shipPlacementHtmlClass)
        }
    }

    const _placePlayerShip = (Gameboard, gridElement, ship, shipOrientation) => {
        const shipOrigin = _getCoordinateFromGridElement(gridElement)
        const orientation = shipOrientation.orientation

        const shipCoordinates = Gameboard.shipPlacementIsValid({
            ship,
            origin: shipOrigin,
            direction: orientation
        })

        if (!shipCoordinates) return

        Gameboard.placeShip({
            ship,
            origin: shipOrigin,
            direction: orientation
        })

        shipCoordinates.forEach(coordinate => {
            const gridElement = _getGridElementAtCoordinate(_laydownGridParentId, coordinate)
            gridElement.classList.add(_sipPlacementHtmlClasses.placed)
            gridElement.classList.remove(_sipPlacementHtmlClasses.valid)
            gridElement.classList.remove(_sipPlacementHtmlClasses.invalid)
        })

        if (_curShipIdx >= _availableShips.length - 1) _endPlayerShipPlacement()
        else _updateCurrentShip()
    }

    const _updateCurrentShip = () => {
        _curShipIdx = _curShipIdx || _curShipIdx === 0 ? _curShipIdx + 1 : 0
        _curShip = _availableShips[_curShipIdx].ship
        _curShipNameElement.innerText = _availableShips[_curShipIdx].name
    }

    const _endPlayerShipPlacement = () => {
        // get all elements with ship-placed class then you can record rows and columns from there then copy to other grid
        const gridElementsWithShip = document.querySelectorAll('#laydown-grid > .ship-placed')
        gridElementsWithShip.forEach(gridElement => {
            const coordinate = _getCoordinateFromGridElement(gridElement)
            const playerGridElementWithShip = _getGridElementAtCoordinate('player-grid', coordinate)
            playerGridElementWithShip.classList.add('ship-placed')
        })
        modal.close()
    }

    return {
        init,
    }
}