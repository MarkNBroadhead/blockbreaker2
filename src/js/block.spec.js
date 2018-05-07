/*global describe test expect*/
import Block from './block'
import Victor from 'victor'

describe('Block.getCenter', () => {
    test('should return the correct center', () => {
        let block = new Block(new Victor(100, 100), 300, 300, 'black', 1)
        let center = block.getCenter()
        expect(center.x).toBe(250)
        expect(center.y).toBe(250)
        expect(block.position.x).toBe(100)
        expect(block.position.y).toBe(100)

        let block2 = new Block(new Victor(50, 50), 4, 8, 'black', 1)
        let center2 = block2.getCenter()
        expect(center2.x).toBe(52)
        expect(center2.y).toBe(54)
        expect(block.position.x).toBe(100)
        expect(block.position.y).toBe(100)
    })
})

describe('Block.getCornerAngle', () => {
    test('should return PI/4 when a square', () => {
        let block = new Block(new Victor(100, 100), 300, 300, 'black', 1)
        expect(block.getCornerAngle()).toBe(Math.PI/4)
        expect(block.position.x).toBe(100)
        expect(block.position.y).toBe(100)
    })
})