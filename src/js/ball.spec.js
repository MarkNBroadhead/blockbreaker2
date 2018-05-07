/*global describe test expect*/
import Ball from './ball'
import Victor from 'victor'

describe('Ball class', () => {
    test('should have a ball that sets the color properly', () => {
        let ball = new Ball(new Victor(1, 1), new Victor(1, 1), 'black', 1, false)
        expect(ball.color).toBe('black')
    })
})
