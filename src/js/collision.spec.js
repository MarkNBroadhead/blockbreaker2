/*global describe test expect*/
import {checkIfBallAndBlockAreColliding, isVerticalTo, getAngle} from './collision'
import Victor from 'victor'
import Ball from './ball'
import Block from './block'

const color = 'black'
const velocity = new Victor(1, 1)
let block1 = new Block(new Victor(100, 100), 10, 10, color, 1)
let block2 = new Block(new Victor(200, 200), 10, 10, color, 1)
describe('Collision.isVerticalTo', () => {
    test('should return true if ball is below block1', () => {
        let ball = new Ball(new Victor(105, 111), velocity, color, 1)
        let result = isVerticalTo(ball, block1)
        expect(result).toBe(true)
    })
    test('should return true if ball is below block2', () => {
        let ball = new Ball(new Victor(205, 250), velocity, color, 1)
        let result = isVerticalTo(ball, block2)
        expect(result).toBe(true)
    })
    test('should return true if ball is above block1', () => {
        let ball = new Ball(new Victor(105, 10), velocity, color, 1)
        let result = isVerticalTo(ball, block1)
        expect(result).toBe(true)
    })
    test('should return true if ball is above block2', () => {
        let ball = new Ball(new Victor(205, 110), velocity, color, 1)
        let result = isVerticalTo(ball, block2)
        expect(result).toBe(true)
    })
    test('should return false if ball is directly right of block1', () => {
        let ball = new Ball(new Victor(200, 105), velocity, color, 1)
        let result = isVerticalTo(ball, block1)
        expect(result).toBe(false)
    })
    test('should return false if ball is directly right of block2', () => {
        let ball = new Ball(new Victor(210, 205), velocity, color, 1)
        let result = isVerticalTo(ball, block2)
        expect(result).toBe(false)
    })
    test('should return false if ball is directly left of block1', () => {
        let ball = new Ball(new Victor(90, 105), velocity, color, 1)
        let result = isVerticalTo(ball, block1)
        expect(result).toBe(false)
    })
    test('should return false if ball is directly left of block2', () => {
        let ball = new Ball(new Victor(190, 205), velocity, color, 1)
        let result = isVerticalTo(ball, block2)
        expect(result).toBe(false)
    })
    test('should return true if ball is below block', () => {
        let block = new Block(new Victor(800, 250), 100, 50, 'black', 0)
        let ball = new Ball(new Victor(842, 318), new Victor(-3, -3, 'purple', 20, false))
        let result = isVerticalTo(ball, block)
        expect(result).toBe(true)
    })
})

describe('Collision.getAngle', () => {
    let block = new Block(new Victor(100, 100), 10, 10, color, 1)
    test('should return 0 when ball is directly to the right of block', () => {
        let ball = new Ball(new Victor(150, 105), velocity, color, 1)
        expect(getAngle(block, ball)).toBe(0)
    })
    test('should return PI/2 when ball is directly above block', () => {
        let ball = new Ball(new Victor(105, 150), velocity, color, 1)
        expect(getAngle(block, ball)).toBe(Math.PI/2)
    })
})

describe('learning Victor.subtract()', () => {
    test('should return 2 PI when circle is directly to the right', () => {
        let squareCenter = new Victor(1, 1)
        let circle = new Victor(3, 1)
        let expectedVector = new Victor(-2, 0)
        expect(squareCenter.subtract(circle)).toMatchObject(expectedVector)
        expect(expectedVector.angle()).toBe(Math.PI)
    })
    test('should return -PI/2 when circle is directly above', () => {
        let squareCenter = new Victor(1, 1)
        let circle = new Victor(1, 3)
        let expectedVector = new Victor(0, -2)
        expect(squareCenter.subtract(circle)).toMatchObject(expectedVector)
        expect(expectedVector.angle()).toBe(-Math.PI/2)
    })
    test('should return when circle is directly to the left', () => {
        let squareCenter = new Victor(1, 1)
        let circle = new Victor(-1, 1)
        let expectedVector = new Victor(2, 0)
        expect(squareCenter.subtract(circle)).toMatchObject(expectedVector)
        expect(expectedVector.angle()).toBe(0)
    })
    test('should return PI/2 when circle is directly below', () => {
        let squareCenter = new Victor(1, 1)
        let circle = new Victor(1, -3)
        let expectedVector = new Victor(0, 4)
        expect(squareCenter.subtract(circle)).toMatchObject(expectedVector)
        expect(expectedVector.angle()).toBe(Math.PI/2)
    })
})

describe('.checkIfBallAndBlockAreColliding', () => {
    // not touching
    test('should return false if the distance is obviously too far on x axis', () => {
        let ball = new Ball(new Victor(31, 10), velocity, color, 10, false)
        let block = new Block(new Victor(10, 10), 10, 10, color, 1)
        expect(checkIfBallAndBlockAreColliding(ball, block)).toBe(false)
    })
    test('should return false if the distance is obviously too far on y axis', () => {
        let ball = new Ball(new Victor(10, 31), velocity, color, 10, false)
        let block = new Block(new Victor(10, 10), 10, 10, color, 1)
        expect(checkIfBallAndBlockAreColliding(ball, block)).toBe(false)
    })
    test('should return false if they are not touching', () => {
        let ball = new Ball(new Victor(10, 31), velocity, color, 10, false)
        let block = new Block(new Victor(10, 10), 10, 10, color, 1)
        expect(checkIfBallAndBlockAreColliding(ball, block)).toBe(false)

        let ball2 = new Ball(new Victor(3, 31), velocity, color, 10, false)
        let block2 = new Block(new Victor(10, 10), 10, 10, color, 1)
        expect(checkIfBallAndBlockAreColliding(ball2, block2)).toBe(false)
    })
    test('should return false when ball is not touching block', () => {
        let block = new Block(new Victor(800, 250), 100, 50, 'black', 1)
        let ball = new Ball(new Victor(815, 345), new Victor(3, -3), 'black', 20, false)
        expect(checkIfBallAndBlockAreColliding(ball, block)).toBe(false)
    })
    // touching
    test('should return true if they are touching on y axis below block', () => {
        let ball = new Ball(new Victor(15, 30), velocity, color, 10, false)
        let block = new Block(new Victor(10, 10), 10, 10, color, 1)
        expect(checkIfBallAndBlockAreColliding(ball, block)).toBe(true)
    })
    test('should return true if they are touching on y axis above block', () => {
        let ball = new Ball(new Victor(15, 5), velocity, color, 10, false)
        let block = new Block(new Victor(10, 10), 10, 10, color, 1)
        expect(checkIfBallAndBlockAreColliding(ball, block)).toBe(true)
    })
    test('should return true if they are touching on x axis left of block', () => {
        let ball = new Ball(new Victor(1, 15), velocity, color, 10, false)
        let block = new Block(new Victor(10, 10), 10, 10, color, 1)
        expect(checkIfBallAndBlockAreColliding(ball, block)).toBe(true)
    })
    test('should return true if they are touching on x axis right of block', () => {
        let ball = new Ball(new Victor(30, 15), velocity, color, 10, false)
        let block = new Block(new Victor(10, 10), 10, 10, color, 1)
        expect(checkIfBallAndBlockAreColliding(ball, block)).toBe(true)
    })
    test('should return false if circle is close but not touching corner', () => {
        let ball = new Ball(new Victor(22,22), velocity, color, 2, false)
        let block = new Block(new Victor(10, 10), 10, 10, color, 1)
        expect(checkIfBallAndBlockAreColliding(ball, block)).toBe(false)
    })


    // test('testing distance stuff', () => {
    //     let _ball = new Ball(new Victor(30, 15), velocity, color, 2, false)
    //     let _block = new Block(new Victor(10, 10), 10, 10, color, 1)
    //     let _centerVector = new Victor(_block.height/2, _block.width/2)
    //     let _blockCenter = _block.position.add(_centerVector)
    //     let _dist = new Victor(_ball.position.absDistanceX(_blockCenter), _ball.position.absDistanceY(_blockCenter))
    //     expect(_dist.x).toBe(15)
    //     expect(_dist.y).toBe(0)
    // })
})
