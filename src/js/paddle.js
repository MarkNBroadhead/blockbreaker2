export default class Paddle {
    constructor(position, maxSpeed, color, width, height, isSticky) {
        this.position = position.clone()
        this.maxSpeed = maxSpeed.clone()
        this.color = color
        this.width = width
        this.height = height
        this.isSticky = isSticky
    }
    draw(ctx) {
        ctx.fillStyle = this.color
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    releaseBall() {

    }
}