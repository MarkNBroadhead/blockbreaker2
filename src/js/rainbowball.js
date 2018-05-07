export default class RainbowBall {
    constructor(position, speed, insideColor, outsideColor, radius, isStuckToPaddle) {
        this.position = position.clone()
        this.speed = speed.clone()
        this.insideColor = insideColor
        this.outsideColor = outsideColor
        this.radius = radius
        this.isStuckToPaddle = isStuckToPaddle
    }
    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true)
        this.gradient = ctx.createRadialGradient(this.position.x, this.position.y, this.radius, this.position.x, this.position.y, 1)
        this.gradient.addColorStop(0, this.outsideColor)
        this.gradient.addColorStop(1, this.insideColor)
        ctx.fillStyle = this.gradient
        ctx.fill()
    }
}