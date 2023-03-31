import Player from '../player'

describe('Player', () => {
    let mockGameboard
    let receiveAttackCalled = false
    const gridSize = 10
    beforeAll(() => {
        mockGameboard = {
            getGameboardSize: () => gridSize,
            receiveAttack: ({ attackCoordinate }) => {
                receiveAttackCalled = true
                console.log(attackCoordinate)
                const [row, col] = attackCoordinate
                return row < gridSize && col < gridSize
            }
        }

    })

    let player
    beforeEach(() => {
        player = Player(mockGameboard)
    })

    it('calls Gameboard.receiveAttack()', () => {
        expect(receiveAttackCalled).toBeFalsy()
        player.attackCoordinate([1, 2])
        expect(receiveAttackCalled).toBeTruthy()
    })

    it('attacks random coordinate', () => {
        expect(player.attackRandomCoordinate()).toBeTruthy()
    })
})

