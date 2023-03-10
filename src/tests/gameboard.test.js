const Gameboard = require("../gameboard");

describe('Gameboard', () => {

    let mockShip;
    beforeAll(() => {
        mockShip = {
            getLength: () => 4
        }

    })

    let grid, gameboard
    beforeEach(() => {
        gameboard = Gameboard()
        // set up 10x10 grid
        grid = Array(10).fill().map(() => Array(10).fill(false))
    })

    it('adds ship with orientation up', () => {
        const gridWithShipUp = gameboard.placeShip(mockShip, [6, 4], 'up')
        grid[6][4] = true
        grid[5][4] = true
        grid[4][4] = true
        grid[3][4] = true

        expect(gridWithShipUp).toEqual(grid)
    })

    it('adds ship with orientation down', () => {
        const gridWithShipDown = gameboard.placeShip(mockShip, [2, 0], 'down')
        grid[2][0] = true
        grid[3][0] = true
        grid[4][0] = true
        grid[5][0] = true

        expect(gridWithShipDown).toEqual(grid)
    })

    it('adds ship with orientation left', () => {
        const gridWithShipLeft = gameboard.placeShip(mockShip, [4, 9], 'left')
        grid[4][9] = true
        grid[4][8] = true
        grid[4][7] = true
        grid[4][6] = true

        expect(gridWithShipLeft).toEqual(grid)
    })

    it('adds ship with orientation right', () => {
        const gridWithShipRight = gameboard.placeShip(mockShip, [9, 3], 'right')
        grid[9][3] = true
        grid[9][4] = true
        grid[9][5] = true
        grid[9][6] = true

        expect(gridWithShipRight).toEqual(grid)
    })

    it('returns null if orientation is invalid', () => {
        expect(gameboard.placeShip(mockShip, [3, 1], 'north')).toBeNull()
    })
})