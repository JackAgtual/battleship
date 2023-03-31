import Ship from '../ship'

describe('Ship', () => {

    it('should not sink if not hit', () => {
        const shipWithNoHits = Ship({ length: 2 })
        expect(shipWithNoHits.isSunk()).toBe(false)
    })

    it('should not sink if hits < length', () => {
        const shipWithLessHitsThanLenght = Ship({ length: 4, numHits: 2 })
        expect(shipWithLessHitsThanLenght.isSunk()).toBeFalsy()
    })

    it('should sink when hits == length', () => {
        const shipWithSameHitsAsLength = Ship({ length: 10, numHits: 10 })
        expect(shipWithSameHitsAsLength.isSunk()).toBeTruthy()
    })

    it('should sink when hits > length', () => {
        const shipWithMoreHitsThanLength = Ship({ length: 6, numHits: 7 })
        expect(shipWithMoreHitsThanLength.isSunk()).toBeTruthy()
    })

    it('should increment num hits when hit', () => {
        const ship = Ship({ length: 3 })
        expect(ship.hit()).toBe(1)
    })
})
