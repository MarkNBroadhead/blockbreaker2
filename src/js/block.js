import Victor from 'victor'
import _ from 'lodash'

export default class Block {
    constructor(position, width, height, color, health) {
        this.position = position.clone()
        this.width = width
        this.height = height
        this.color = color
        this.health = health
    }
    draw(ctx) {
        ctx.fillStyle = this.color
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    getCenter() {
        let halfDimensions = new Victor(this.width/2, this.height/2)
        let _tempCorner = _.cloneDeep(this.position)
        _tempCorner.add(halfDimensions)
        return _tempCorner
    }
    getCornerAngle() {
        let topRightCorner = new Victor(this.position.x + this.width, this.position.y)
        return Math.abs(topRightCorner.subtract(this.getCenter()).angle())
    }
}