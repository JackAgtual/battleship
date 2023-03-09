function Ship({ length, numHits = 0 }) {
    const _length = length
    let _numHits = numHits

    const hit = () => _numHits++

    const isSunk = () => _numHits >= _length

    return {
        hit,
        isSunk
    }
}

module.exports = Ship