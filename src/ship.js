export default function Ship({ length, numHits = 0 }) {
    const _length = length
    let _numHits = numHits

    const hit = () => {
        _numHits++
        return _numHits
    }

    const isSunk = () => _numHits >= _length

    const getLength = () => _length

    return {
        hit,
        isSunk,
        getLength
    }
}