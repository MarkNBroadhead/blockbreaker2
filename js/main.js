var canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('myCanvas'))
var ctx = canvas.getContext('2d')
canvas.height = 700
canvas.width = 1000

var defaultBallRadius = 20
var defaultBallSpeed = 5
var blockWidth = 101
var blockHeight = 40
var numBlockRows = 5
var paddleWidth = 200
var paddleHeight = 20
var paddleSpeed = 15
var alternatingBlocks = true

let state = {
    left: false,
    right: false,
    lives: 3
}

let leftKeys = ['KeyA', 'KeyN', 'ArrowLeft']
let rightKeys = ['KeyD', 'KeyP', 'ArrowRight']

class Ball {
    constructor(x, y, speed, color, radius, isStuckToPaddle) {
        this.x = x
        this.y = y
        this.speed = speed
        this.color = color
        this.radius = radius
        this.isStuckToPaddle = isStuckToPaddle
    }
    draw() {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true)
        ctx.fill()
    }
}

class RainbowBall {
    constructor(x, y, speed, insideColor, outsideColor, radius, isStuckToPaddle) {
        this.x = x
        this.y = y
        this.speed = speed
        this.insideColor = insideColor
        this.outsideColor = outsideColor
        this.radius = radius
        this.isStuckToPaddle = isStuckToPaddle
    }
    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true)
        this.gradient = ctx.createRadialGradient(this.x, this.y, this.radius, this.x, this.y, 1)
        this.gradient.addColorStop(0, this.outsideColor)
        this.gradient.addColorStop(1, this.insideColor)
        ctx.fillStyle = this.gradient
        ctx.fill()
    }
}

class Paddle {
    constructor(x, y, maxSpeed, color, width, height, isSticky) {
        this.x = x
        this.y = y
        this.maxSpeed = maxSpeed
        this.color = color
        this.width = width
        this.height = height
        this.isSticky = isSticky
    }
    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
    releaseBall() {

    }
}

class Block {
    constructor(x, y, width, height, color, health) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.health = health
    }
    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

/* Initialize Balls */
// var firstBall = new Ball(200, 300, defaultBallSpeed, 'rgb(40, 65, 255)', 70, false)
// var rainbow = new RainbowBall(870, 320, defaultBallSpeed, 'rgb(102, 0, 255)', 'rgb(255, 0, 238)', 100, false)
var balls = []
// balls.push(firstBall, rainbow)

/* Initialize Blocks */
var numBlockColumns = Math.floor(canvas.width / blockWidth)
var xPadding = (canvas.width % blockWidth) / 2
var blocks = initializeBlocks(numBlockColumns, numBlockRows, xPadding, 50, blockWidth, blockHeight)

/* Initialize Paddle */
var paddle = new Paddle(canvas.width/2-paddleWidth/2, canvas.height-paddleHeight, 5, 'black', paddleWidth, paddleHeight, false)

function update() {
    updatePaddle()
    updateBalls()
}

function updatePaddle() {
    if(state.left) {
        paddle.x = paddle.x - paddleSpeed
    }
    if(state.right) {
        paddle.x = paddle.x + paddleSpeed
    }
    if(paddle.x < 0) {
        paddle.x = 0
    }
    if(paddle.x > (canvas.width - paddle.width)) {
        paddle.x = canvas.width - paddle.width
    }
}

function updateBalls() {
    for (let ball of balls) {
        if(ball.isStuckToPaddle) {
            ball.x = paddle.x + paddle.width/2
            ball.y = paddle.y - ball.radius
        } else {
            // move the balls
            // check for collisions
            // delete blocks? (Not sure if here is the right place)
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    paddle.draw()
    for (var block of blocks) {
        block.draw()
    }
    for (var ball of balls) {
        ball.draw()
    }
}

function initializeBlocks(columns, rows, col1X, row1Y, width, height) {
    var newBlocks = []
    var blockColors = ['red', 'orange', 'yellow', 'blue', 'green', 'pink', 'purple']
    for (var x = 0; x < columns; x++) {
        for (var y = 0; y < rows; y++) {
            if(!alternatingBlocks || (x + y) % 2) {
                var nextColor = blockColors[Math.floor(Math.random() * blockColors.length)]
                newBlocks.push(new Block(col1X + x * width, row1Y + y * height, width, height, nextColor, 1))
            }
        }
    }
    return newBlocks
}

function addBallToPaddle(balls, paddle) {
    balls.push(new Ball(paddle.x + paddleWidth/2, paddle.y - defaultBallRadius, defaultBallSpeed, 'purple', defaultBallRadius, true))
}
addBallToPaddle(balls, paddle)

window.addEventListener('keydown', (key) => {
    if(leftKeys.includes(key.code)) {
        state.left = true
    } else if(rightKeys.includes(key.code)) {
        state.right = true
    }
})

window.addEventListener('keyup', (key) => {
    if(leftKeys.includes(key.code)) {
        state.left = false
    } else if(rightKeys.includes(key.code)) {
        state.right = false 
    }
})

;(function () {
    function main() {
        window.requestAnimationFrame( main )
        update()
        draw()
    }
    main()
})()
