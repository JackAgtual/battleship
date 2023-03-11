const Gameboard = require("../gameboard");

describe('Gameboard', () => {

    let mockShip;
    beforeAll(() => {
        mockShip = {
            getLength: () => 4
        }
    })

    let gameboard
    beforeEach(() => {
        gameboard = Gameboard()
    })

    describe('placeShip()', () => {

        let grid
        beforeEach(() => {
            // set up 10x10 grid
            grid = Array(10).fill().map(() => Array(10).fill(false))
        })

        it('adds ship with orientation up', () => {
            const gridWithShipUp = gameboard.placeShip(mockShip, [6, 4], 'up')
            grid[6][4] = mockShip
            grid[5][4] = mockShip
            grid[4][4] = mockShip
            grid[3][4] = mockShip

            expect(gridWithShipUp).toEqual(grid)
        })

        it('adds ship with orientation down', () => {
            const gridWithShipDown = gameboard.placeShip(mockShip, [2, 0], 'down')
            grid[2][0] = mockShip
            grid[3][0] = mockShip
            grid[4][0] = mockShip
            grid[5][0] = mockShip

            expect(gridWithShipDown).toEqual(grid)
        })

        it('adds ship with orientation left', () => {
            const gridWithShipLeft = gameboard.placeShip(mockShip, [4, 9], 'left')
            grid[4][9] = mockShip
            grid[4][8] = mockShip
            grid[4][7] = mockShip
            grid[4][6] = mockShip

            expect(gridWithShipLeft).toEqual(grid)
        })

        it('adds ship with orientation right', () => {
            const gridWithShipRight = gameboard.placeShip(mockShip, [9, 3], 'right')
            grid[9][3] = mockShip
            grid[9][4] = mockShip
            grid[9][5] = mockShip
            grid[9][6] = mockShip

            expect(gridWithShipRight).toEqual(grid)
        })

        it('returns falsy if orientation is invalid', () => {
            expect(gameboard.placeShip(mockShip, [3, 1], 'north')).toBeFalsy()
        })

        it('returns falsy if origin is out of bounds', () => {
            expect(gameboard.placeShip(mockShip, [10, 0], 'right')).toBeFalsy()
        })

        it('returns falsy if ship is too long for up orientation', () => {
            expect(gameboard.placeShip(mockShip, [2, 4], 'up')).toBeFalsy()
        })

        it('returns falsy if ship is too long for down orientation', () => {
            expect(gameboard.placeShip(mockShip, [9, 0], 'down')).toBeFalsy()
        })

        it('returns falsy if ship is too long for left orientation', () => {
            expect(gameboard.placeShip(mockShip, [5, 2], 'left')).toBeFalsy()
        })

        it('returns falsy if ship is too long for right orientation', () => {
            expect(gameboard.placeShip(mockShip, [1, 8], 'right')).toBeFalsy()
        })
    })

    describe('receiveAttack()', () => {

        let attackGrid, shipGrid
        beforeEach(() => {
            const gridSize = 10
            shipGrid = Array(gridSize).fill().map(() => Array(gridSize).fill(false))

            // ship 1
            shipGrid[0][6] = true
            shipGrid[0][7] = true
            shipGrid[0][8] = true
            shipGrid[0][9] = true

            // ship 2
            shipGrid[7][2] = true
            shipGrid[8][2] = true

            attackGrid = Array(gridSize).fill().map(() => Array(gridSize).fill(false))
            // previous attacks
            attackGrid[7][2] = true
            attackGrid[3][6] = true
            attackGrid[2][2] = true
            attackGrid[0][8] = true
        })
    })
})