/* global Victor */
var canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('myCanvas'))
var ctx = canvas.getContext('2d')
canvas.height = 700
canvas.width = 1000

var defaultBallRadius = 20
var defaultBallSpeed = new Victor(7,-7)
var blockWidth = 50 
var blockHeight = 150
var blockDiagonal = Math.sqrt(blockWidth^2 + blockHeight^2)
var numBlockRows = 3
var numBlockColumns = Math.floor(canvas.width / blockWidth)
var xPadding = (canvas.width % blockWidth) / 2
var paddleWidth = 90
var paddleHeight = 20
var alternatingBlocks = false
var startingBallStockpile = 3

let state = {}

let leftKeys = ['KeyA', 'KeyN', 'ArrowLeft']
let rightKeys = ['KeyD', 'KeyP', 'ArrowRight']
let releaseBallKeys = ['Space']

class Ball {
    constructor(position, speed, color, radius, isStuckToPaddle) {
        this.position = position.clone()
        this.speed = speed.clone()
        this.color = color
        this.radius = radius
        this.isStuckToPaddle = isStuckToPaddle
    }
    draw() {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, true)
        ctx.fill()
    }
}

class RainbowBall {
    constructor(position, speed, insideColor, outsideColor, radius, isStuckToPaddle) {
        this.position = position.clone()
        this.speed = speed.clone()
        this.insideColor = insideColor
        this.outsideColor = outsideColor
        this.radius = radius
        this.isStuckToPaddle = isStuckToPaddle
    }
    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true)
        this.gradient = ctx.createRadialGradient(this.position.x, this.position.y, this.radius, this.position.x, this.position.y, 1)
        this.gradient.addColorStop(0, this.outsideColor)
        this.gradient.addColorStop(1, this.insideColor)
        ctx.fillStyle = this.gradient
        ctx.fill()
    }
}

class Paddle {
    constructor(position, maxSpeed, color, width, height, isSticky) {
        this.position = position.clone()
        this.maxSpeed = maxSpeed.clone()
        this.color = color
        this.width = width
        this.height = height
        this.isSticky = isSticky
    }
    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    releaseBall() {

    }
}

class Block {
    constructor(position, width, height, color, health) {
        this.position = position.clone()
        this.width = width
        this.height = height
        this.color = color
        this.health = health
    }
    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

function newGame() {
    state = {
        left: false,
        right: false,
        ballStockpile: startingBallStockpile,
        balls: [],
        paddle: createPaddle(),
        blocks: initializeBlocks(numBlockColumns, numBlockRows, xPadding, 50, blockWidth, blockHeight)
    }
    // var firstBall = new Ball(200, 300, defaultBallSpeed, 'rgb(40, 65, 255)', 70, false)
    // var rainbow = new RainbowBall(870, 320, defaultBallSpeed, 'rgb(102, 0, 255)', 'rgb(255, 0, 238)', 100, false)
    // state.balls.push(firstBall, rainbow)
    addBallToPaddle()
}
newGame()

function createPaddle() {
    return new Paddle(new Victor(canvas.width / 2 - paddleWidth / 2, canvas.height - paddleHeight), new Victor(10, 0), 'black', paddleWidth, paddleHeight, false)
}

function update() {
    updatePaddle()
    updateBalls()
    deleteBlocksWithNoHealth()
    detectLevelEnd()
}

function updatePaddle() {
    if(state.left) {
        state.paddle.position = state.paddle.position.subtract(state.paddle.maxSpeed)
    }
    if(state.right) {
        state.paddle.position = state.paddle.position.add(state.paddle.maxSpeed)
    }
    if(state.paddle.position.x < 0) {
        state.paddle.position.x = 0
    }
    if(state.paddle.position.x > (canvas.width - state.paddle.width)) {
        state.paddle.position.x = canvas.width - state.paddle.width
    }
}

function updateBalls() {
    for (let ball of state.balls) {
        if (ball.isStuckToPaddle) {
            ball.position.x = state.paddle.position.x + state.paddle.width / 2
            ball.position.y = state.paddle.position.y - ball.radius
        } else {
            if(shouldReflectOnRightWall(ball) || shouldReflectOffLeftWall(ball)) {
                ball.speed.invertX()
            }
            if(shouldReflectOffTopWall(ball) || shouldReflectOffPaddle(ball, state.paddle)) {
                ball.speed.invertY()
            }
            ball.position.add(ball.speed)
            handleBlockCollisions(ball, state.blocks)
        }
    }
    deleteBallsTouchingBottom(state.balls)
}

function deleteBallsTouchingBottom(balls) {
    if (balls.length > 0) {
        for (let i = balls.length - 1; i >= 0; i--) {
            if (balls[i].position.y > canvas.height + balls[i].radius) {
                balls.splice(i, 1)
                if (balls.length <= 0) {
                    getAnotherBall()
                }
            }
        }
    }
}

function getAnotherBall() {
    if (state.ballStockpile > 0) {
        state.ballStockpile--
        addBallToPaddle()
    } else {
        gameOver()
    }
}

function gameOver() {
    alert('Game over')
    newGame()
}

function handleBlockCollisions(ball, blocks) {
    for (let block of blocks) {
        let blockCenter = block.position.clone()
        blockCenter.y = blockCenter.y + block.height / 2
        blockCenter.x = blockCenter.x + block.width / 2
        checkIfBallAndBlockAreColliding(ball, block, blockCenter)
    }
}

function checkIfBallAndBlockAreColliding(ball, block, blockCenter) {
    let dist = new Victor(ball.position.absDistanceX(blockCenter), ball.position.absDistanceY(blockCenter))
    if (dist.y > blockHeight / 2 + ball.radius || dist.x > blockWidth / 2 + ball.radius) {
        return false
    }
    if (dist.y <= blockCenter.y / 2) {
        block.health --
        ball.speed.invertY()
        return true
    }
    if (dist.x <= blockCenter.x / 2) {
        block.health --
        ball.speed.invertX()
        return true
    }
    // var distanceFromEdges = dist.subtract(new Victor(block.position.divide(2)))
    // var xAndYFromEdgesSquared = distanceFromEdges.lengthSq() 
    // if(xAndYFromEdgesSquared <= ball.radius^2) {
    //     if()

    //     return true
    // }
}

function deleteBlocksWithNoHealth() {
    if (state.blocks.length > 0) {
        for (let i = state.blocks.length - 1; i >= 0; i--) {
            if (state.blocks[i].health < 1) {
                state.blocks.splice(i, 1)

            }
            // else if (typeof blocks[i].position.x === 'undefined' 
            //     || !blocks[i].position.x
            //     || typeof blocks[i].position.y === 'undefined'
            //     || !blocks[i].position.y) {
            //     blocks.splice(i, 1)
            // }
        }
    }
}

function shouldReflectOnRightWall(ball) {
    return ball.speed.x > 0 && ball.position.x > canvas.width - ball.radius
}

function shouldReflectOffLeftWall(ball) {
    return ball.speed.x < 0 && ball.position.x < ball.radius
}

function shouldReflectOffTopWall(ball) {
    return ball.speed.y < 0 && ball.position.y < ball.radius
}

function shouldReflectOffPaddle(ball, paddle) {
    return ball.speed.y > 0 
        && ball.position.y + ball.radius >= paddle.position.y 
        && ball.position.y + ball.radius < paddle.position.y + 40
        && ball.position.x > paddle.position.x
        && ball.position.x < paddle.position.x + paddle.width
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    state.paddle.draw()
    for (var block of state.blocks) {
        block.draw()
    }
    for (var ball of state.balls) {
        ball.draw()
    }
    ctx.font = '20px Arial'
    ctx.fillText('Lives: ' +  state.ballStockpile, 10, 30)
}

function initializeBlocks(columns, rows, col1X, row1Y, width, height) {
    var newBlocks = []
    var blockColors = ['red', 'orange', 'yellow', 'blue', 'green', 'pink', 'purple']
    for (var x = 0; x < columns; x++) {
        for (var y = 0; y < rows; y++) {
            if(!alternatingBlocks || (x + y) % 2) {
                var nextColor = blockColors[Math.floor(Math.random() * blockColors.length)]
                newBlocks.push(new Block(new Victor(col1X + x * width, row1Y + y * height), width, height, nextColor, 1))
            }
        }
    }
    return newBlocks
}

function addBallToPaddle() {
    state.balls.push(new Ball(new Victor(state.paddle.position.x + paddleWidth / 2, state.paddle.position.y - defaultBallRadius), defaultBallSpeed, 'purple', defaultBallRadius, true))
}

function releaseBall() {
    let stuckBalls = state.balls.filter(ball => ball.isStuckToPaddle)
    if (stuckBalls !== null && stuckBalls !== undefined && stuckBalls.length > 0) {
        stuckBalls[0].isStuckToPaddle = false
    }
}

function detectLevelEnd() {
    if (state.blocks.length < 1) {
        this.alternatingBlocks = !this.alternatingBlocks
        state.blocks = initializeBlocks(numBlockColumns, numBlockRows, xPadding, 50, blockWidth, blockHeight)
        state.balls = []
        addBallToPaddle()
        releaseBall()
    }
}

window.addEventListener('keydown', (key) => {
    if(leftKeys.includes(key.code)) {
        state.left = true
    } else if(rightKeys.includes(key.code)) {
        state.right = true
    } else if(releaseBallKeys.includes(key.code)) {
        releaseBall()
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
