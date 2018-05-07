export default class Ball {
    constructor(position, speed, color, radius, isStuckToPaddle) {
        this.position = position.clone()
        this.speed = speed.clone()
        this.color = color
        this.radius = radius
        this.isStuckToPaddle = isStuckToPaddle
    }
    draw(ctx) {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, true)
        ctx.fill()
    }
}