import _, { clone } from 'lodash'
import Gameboard from '../gameboard';

describe('Gameboard', () => {

    let gameboard, mockShip, mockSunkShip, shipHit
    beforeEach(() => {
        gameboard = Gameboard()

        shipHit = false
        mockShip = {
            getLength: () => 4,
            hit: () => shipHit = true,
            isSunk: () => false
        }
        mockSunkShip = {
            isSunk: () => true
        }
    })

    describe('placeShip()', () => {

        let grid, ships
        beforeEach(() => {
            // set up 10x10 grid
            grid = Array(10).fill().map(() => Array(10).fill(false))
            ships = []
        })

        it('adds ship with orientation up', () => {
            const [gridWithShipUp, populatedShips] = gameboard.placeShip({
                ship: mockShip,
                origin: [6, 4],
                direction: 'up',
                shipGrid: _.cloneDeep(grid),
                ships: _.cloneDeep(ships)
            })
            grid[6][4] = mockShip
            grid[5][4] = mockShip
            grid[4][4] = mockShip
            grid[3][4] = mockShip

            ships.push(mockShip)

            expect(gridWithShipUp).toEqual(grid)
            expect(ships).toEqual(populatedShips)
        })

        it('adds ship with orientation down', () => {
            const [gridWithShipDown, populatedShips] = gameboard.placeShip({
                ship: mockShip,
                origin: [2, 0],
                direction: 'down',
                shipGrid: _.cloneDeep(grid),
                ships: _.cloneDeep(ships)
            })
            grid[2][0] = mockShip
            grid[3][0] = mockShip
            grid[4][0] = mockShip
            grid[5][0] = mockShip

            ships.push(mockShip)

            expect(gridWithShipDown).toEqual(grid)
            expect(ships).toEqual(populatedShips)
        })

        it('adds ship with orientation left', () => {
            const [gridWithShipLeft, populatedShips] = gameboard.placeShip({
                ship: mockShip,
                origin: [4, 9],
                direction: 'left',
                shipGrid: _.cloneDeep(grid),
                ships: _.cloneDeep(ships)
            })
            grid[4][9] = mockShip
            grid[4][8] = mockShip
            grid[4][7] = mockShip
            grid[4][6] = mockShip

            ships.push(mockShip)

            expect(gridWithShipLeft).toEqual(grid)
            expect(ships).toEqual(populatedShips)
        })

        it('adds ship with orientation right', () => {
            const [gridWithShipRight, populatedShips] = gameboard.placeShip({
                ship: mockShip,
                origin: [9, 3],
                direction: 'right',
                shipGrid: _.cloneDeep(grid),
                ships: _.cloneDeep(ships)
            })
            grid[9][3] = mockShip
            grid[9][4] = mockShip
            grid[9][5] = mockShip
            grid[9][6] = mockShip

            ships.push(mockShip)

            expect(gridWithShipRight).toEqual(grid)
            expect(ships).toEqual(populatedShips)
        })

        it('returns falsy if orientation is invalid', () => {
            expect(gameboard.placeShip({
                ship: mockShip,
                origin: [3, 1],
                direction: 'north',
                shipGrid: _.cloneDeep(grid),
                ships: _.cloneDeep(ships)
            })).toBeFalsy()
        })

        it('returns falsy if origin is out of bounds', () => {
            expect(gameboard.placeShip({
                ship: mockShip,
                origin: [10, 0],
                direction: 'right',
                shipGrid: _.cloneDeep(grid),
                ships: _.cloneDeep(ships)
            })).toBeFalsy()
        })

        it('returns falsy if ship is too long for up orientation', () => {
            expect(gameboard.placeShip({
                ship: mockShip,
                origin: [2, 4],
                direction: 'up',
                shipGrid: _.cloneDeep(grid),
                ships: _.cloneDeep(ships)
            })).toBeFalsy()
        })

        it('returns falsy if ship is too long for down orientation', () => {
            expect(gameboard.placeShip({
                ship: mockShip,
                origin: [9, 0],
                direction: 'down',
                shipGrid: _.cloneDeep(grid),
                ships: _.cloneDeep(ships)
            })).toBeFalsy()
        })

        it('returns falsy if ship is too long for left orientation', () => {
            expect(gameboard.placeShip({
                ship: mockShip,
                origin: [5, 2],
                direction: 'left',
                shipGrid: _.cloneDeep(grid),
                ships: _.cloneDeep(ships)
            })).toBeFalsy()
        })

        it('returns falsy if ship is too long for right orientation', () => {
            expect(gameboard.placeShip({
                ship: mockShip,
                origin: [1, 8],
                direction: 'right',
                shipGrid: _.cloneDeep(grid),
                ships: _.cloneDeep(ships)
            })).toBeFalsy()
        })

        it('returns falsy if ship overlaps with existing ship', () => {
            grid[5][5] = mockShip
            grid[5][6] = mockShip
            grid[5][7] = mockShip
            grid[5][8] = mockShip

            expect(gameboard.placeShip({
                ship: mockShip,
                origin: [3, 8],
                direction: 'down',
                shipGrid: _.cloneDeep(grid),
                ships: _.cloneDeep(ships)
            })).toBeFalsy()
        })

        it('adds ships with existing ships on gameboard', () => {
            grid[5][5] = mockShip
            grid[5][6] = mockShip
            grid[5][7] = mockShip
            grid[5][8] = mockShip

            ships.push(mockShip)

            const clonedGrid = _.cloneDeep(grid)

            const [gameboardWithTwoShips, populatedShips] = gameboard.placeShip({
                ship: mockShip,
                origin: [6, 8],
                direction: 'down',
                shipGrid: grid,
                ships: _.cloneDeep(ships)
            })

            clonedGrid[6][8] = mockShip
            clonedGrid[7][8] = mockShip
            clonedGrid[8][8] = mockShip
            clonedGrid[9][8] = mockShip

            ships.push(mockShip)

            expect(gameboardWithTwoShips).toEqual(clonedGrid)
            expect(ships).toEqual(populatedShips)
        })
    })

    describe('receiveAttack()', () => {

        let hits, misses, shipGrid
        beforeEach(() => {
            const gridSize = 10
            shipGrid = Array(gridSize).fill().map(() => Array(gridSize).fill(false))

            // ship 1
            shipGrid[0][6] = mockShip
            shipGrid[0][7] = mockShip
            shipGrid[0][8] = mockShip
            shipGrid[0][9] = mockShip

            // ship 2
            shipGrid[7][2] = mockShip
            shipGrid[8][2] = mockShip

            // previous attacks
            hits = [
                [7, 2],
                [0, 8]
            ]
            misses = [
                [3, 6],
                [2, 2],
            ]
        })

        it('appends misses when a missed attack is received and does not modify hits and returns false', () => {
            const hitsClone = _.cloneDeep(hits)
            const missesClone = _.cloneDeep(misses)

            const attackResult = gameboard.receiveAttack({
                attackCoordinate: [4, 4],
                hits,
                misses,
                shipGrid
            })

            missesClone.push([4, 4])

            expect(hitsClone).toEqual(hits)
            expect(missesClone).toEqual(misses)
            expect(attackResult).toBe(false)
        })

        it('appends hits when hit attack is received and does not modify misses and returns true', () => {
            const hitsClone = _.cloneDeep(hits)
            const missesClone = _.cloneDeep(misses)

            const attackResult = gameboard.receiveAttack({
                attackCoordinate: [0, 6],
                hits,
                misses,
                shipGrid
            })

            hitsClone.push([0, 6])

            expect(hitsClone).toEqual(hits)
            expect(missesClone).toEqual(misses)
            expect(attackResult).toBe(true)
        })


        it('does not allow repeat attacks on missed coordinates', () => {
            expect(gameboard.receiveAttack({
                attackCoordinate: [3, 6],
                hits,
                misses,
                shipGrid
            })).toBeNull()
        })

        it('does not allow repeat attacks on hit coordinates', () => {
            expect(gameboard.receiveAttack({
                attackCoordinate: [0, 8],
                hits,
                misses,
                shipGrid
            })).toBeNull()
        })

        it('does not allow attacks out of bounds', () => {
            expect(gameboard.receiveAttack({
                attackCoordinate: [11, 4],
                hits,
                misses,
                shipGrid
            })).toBeNull()
        })

        it('calls hit method on ship if ship is hit', () => {
            expect(shipHit).toBe(false)

            gameboard.receiveAttack({
                attackCoordinate: [8, 2],
                hits,
                misses,
                shipGrid
            })

            expect(shipHit).toBe(true)
        })

        it('does not call hit method on ship if ship is not hit', () => {
            expect(shipHit).toBe(false)

            gameboard.receiveAttack({
                attackCoordinate: [1, 1],
                hits,
                misses,
                shipGrid
            })
            expect(shipHit).toBe(false)
        })
    })

    describe('allShipsAreSunk()', () => {

        it('return false when there are no ships', () => {
            const emptyShipsArray = []
            expect(gameboard.allShipsAreSunk(emptyShipsArray)).toBeFalsy()
        })

        it('returns true when all ships on board are sunk', () => {
            const allShipsSunkArray = [mockSunkShip, mockSunkShip, mockSunkShip]
            expect(gameboard.allShipsAreSunk(allShipsSunkArray)).toBeTruthy()
        })

        it('returns false when not all ships on board are sunk', () => {
            const sunkAndNotSunkShipsArray = [mockShip, mockSunkShip, mockShip, mockShip]
            expect(gameboard.allShipsAreSunk(sunkAndNotSunkShipsArray)).toBeFalsy()
        })
    })
})