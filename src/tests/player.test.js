const Player = require("../player");

describe('Player', () => {
    let player
    beforeEach(() => {
        player = Player()
    })

    it('passes', () => {
        const val = player.test()
        expect(val).toBeTruthy()
    })
})

