
describe('Gameboard', () => {

    let mockShip;
    beforeAll(() => {
        mockShip = {
            getLength: () => 4
        }
    })

    let grid, emptyGrid
    beforeEach(() => {
        // set up 10x10 grid
        grid = Array(10).fill().map(() => Array(10).fill(0))
        emptyGrid = Array(10).fill().map(() => Array(10).fill(0))
    })

})