/*global */
import Victor from 'victor'
import _ from 'lodash'

export function checkIfBallAndBlockAreColliding(ball, block) {
    let _ball = _.cloneDeep(ball)
    let _block = _.cloneDeep(block)
    let centerVector = new Victor(_block.height/2, _block.width/2)
    let blockCenter = _.cloneDeep(_block).position.add(centerVector)
    let dist = new Victor(_ball.position.absDistanceX(blockCenter), _ball.position.absDistanceY(blockCenter))
    // obviously aren't touching
    if (dist.y > _block.height / 2 + _ball.radius
        || dist.x > _block.width / 2 + _ball.radius) {
        return false
    }
    // touching vertically
    if (_ball.position.y + _ball.radius >= _block.position.y
        && _ball.position.y - _ball.radius <= _block.position.y + _block.height
        && _ball.position.x >= _block.position.x
        && _ball.position.x <= _block.position.x + _block.width
    ) {
        return true
    }
    // touching horizontally
    if(_ball.position.x + _ball.radius >= _block.position.x
        && _ball.position.x - _ball.radius <= _block.position.x + _block.width
        && _ball.position.y >= _block.position.y
        && _ball.position.y <= _block.position.y + _block.height
    ) {
        return true
    }
    // touching corner
    let topLeft = _.cloneDeep(_block.position)
    let topRight = _.cloneDeep(topLeft)
    topRight.x += _block.width
    let bottomLeft = _.cloneDeep(topLeft)
    bottomLeft.y += _block.height
    let bottomRight = _.cloneDeep(topLeft)
    bottomRight.y += _block.height
    bottomRight.x += _block.width
    let corners = [topLeft, topRight, bottomLeft, bottomRight]
    for (let corner of corners) {
        if (corner.distance(_ball.position) - _ball.radius < 0) {
            return true
        }
    }
    return false
}

export function isVerticalTo(ball, block) {
    let angle = getAngle(block, ball)
    let cornerAngle = block.getCornerAngle()
    let absAngleQuadrant = Math.abs(angle)
    if (absAngleQuadrant > Math.PI/2) {
        absAngleQuadrant = Math.PI - absAngleQuadrant
    }
    if (absAngleQuadrant > cornerAngle) {
        return true
    }
    return false
}

export function getAngle(block, ball) {
    let _ballPos = _.cloneDeep(ball.position)
    let relativePosition = _ballPos.subtract(block.getCenter())
    return relativePosition.angle()
}
