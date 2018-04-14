var canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('myCanvas'))
var ctx = canvas.getContext('2d')
canvas.height = 700
canvas.width = 1000

class Ball {
    constructor(x, y, speed, color, size, isStuckToPaddle) {
        this.x = x
        this.y = y
        this.speed = speed
        this.color = color
        this.size = size
        this.isStuckToPaddle = isStuckToPaddle
    }
    draw() {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, true)
        ctx.fill()
    }
}

class RainbowBall {
    constructor(x, y, speed, insideColor, outsideColor, size, isStuckToPaddle) {
        this.x = x
        this.y = y
        this.speed = speed
        this.insideColor = insideColor
        this.outsideColor = outsideColor
        this.size = size
        this.isStuckToPaddle = isStuckToPaddle
    }
    draw() {
        ctx.beginPath()
        this.gradient = ctx.createRadialGradient(this.x, this.y, this.size, this.x, this.y, 1);
        this.gradient.addColorStop(0, this.outsideColor)
        this.gradient.addColorStop(1, this.insideColor)
        ctx.fillStyle = this.gradient
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, true)
        ctx.fill()
    }
}

var myBall = new Ball(300, 600, 20, 'rgb(244, 65, 241)', 40, false)
myBall.draw()

new Ball(200, 300, 1, 'rgb(40, 65, 255)', 70, false).draw()
new Ball(500, 100, 1, 'rgb(255, 0, 0)', 20, false).draw()
new Ball(800, 650, 1, 'rgb(0, 255, 0)', 10, false).draw()
new Ball(600, 400, 1, 'rgb(0, 0, 255)', 100, false).draw()

new RainbowBall(870, 320, 1, 'rgb(102, 0, 255)', 'rgb(255, 0, 238)', 100, false).draw()
new RainbowBall(400, 400, 1, '#c79081', '#dfa579', 200, false).draw()




class Paddle {
    constructor() {

    }
    draw() {

    }
    releaseBall() {

    }
}