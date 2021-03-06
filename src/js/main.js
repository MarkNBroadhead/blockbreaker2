import Victor from 'victor'
import Ball from './ball'
import Paddle from './paddle'
import Block from './block'
import {handleBlockCollisions} from './collision'

var canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('myCanvas'))
var ctx = canvas.getContext('2d')
canvas.height = 700
canvas.width = 1000

var defaultBallRadius = 15
var maxBallSpeed = 15
var blockWidth = 100
var blockHeight = 50
var numBlockRows = canvas.height / blockHeight / 3
var numBlockColumns = Math.floor(canvas.width / blockWidth)
var topPadding = (canvas.width % blockWidth) / 2
var paddleWidth = 120
var paddleHeight = 20
var startingBallStockpile = 3

let state = {}

let leftKeys = ['KeyA', 'KeyN', 'ArrowLeft']
let rightKeys = ['KeyD', 'KeyP', 'ArrowRight']
let releaseBallKeys = ['Space']

function newGame() {
    state = {
        left: false,
        right: false,
        ballStockpile: startingBallStockpile,
        balls: [],
        paddle: createPaddle(),
        blocks: initializeBlocks(numBlockColumns, numBlockRows, topPadding, 50, blockWidth, blockHeight),
        alternatingBlocks: false,
        level: 1,
        points: 0
    }
    addBallToPaddle()
}
newGame()

function createPaddle() {
    return new Paddle(new Victor(canvas.width / 2 - paddleWidth / 2, canvas.height - paddleHeight), new Victor(10, 0), 'black', paddleWidth, paddleHeight, false)
}

function update() {
    updatePaddle()
    handleCollisionsAndUpdateBallPositions()
    deleteBlocksWithNoHealth()
    detectLevelEnd()
}

function updatePaddle() {
    if (state.left) {
        state.paddle.position = state.paddle.position.subtract(state.paddle.maxSpeed)
    }
    if (state.right) {
        state.paddle.position = state.paddle.position.add(state.paddle.maxSpeed)
    }
    if (state.paddle.position.x < 0) {
        state.paddle.position.x = 0
    }
    if (state.paddle.position.x > (canvas.width - state.paddle.width)) {
        state.paddle.position.x = canvas.width - state.paddle.width
    }
}

function handleCollisionsAndUpdateBallPositions() {
    for (let ball of state.balls) {
        if (ball.isStuckToPaddle) {
            ball.position.x = state.paddle.position.x + state.paddle.width / 2
            ball.position.y = state.paddle.position.y - ball.radius
        } else {
            if (shouldReflectOnRightWall(ball) || shouldReflectOffLeftWall(ball)) {
                ball.speed.invertX()
            }
            if (shouldReflectOffTopWall(ball)) {
                ball.speed.invertY()
            }
            if (shouldReflectOffPaddle(ball, state.paddle)) {
                ball.speed.invertY()
                if (state.left) {
                    ball.speed.x = ball.speed.x - 1
                }
                if (state.right) {
                    ball.speed.x = ball.speed.x + 1
                }
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

function getNewBallSpeed(level) {
    let initial = 6
    return new Victor.fromArray([Math.min(initial + level, maxBallSpeed), Math.max(-initial - level, -maxBallSpeed)])
}

function gameOver() {
    let numLevels = state.level - 1 > 0 ? state.level : "0"
    let levelMessage = state.level == 1 ? "levels": "level"
    let message = 'Game over!\nYou completed ' + numLevels + ' ' + levelMessage + ' with a score of ' + state.points + '!'
    if (state.level > 4) {
        message += "\nYOU ROCK!"
    }
    alert(message);
    newGame()
}

function initializeBlocks(columns, rows, col1X, row1Y, width, height) {
    var newBlocks = []
    var blockColors = ['red', 'orange', 'yellow', 'blue', 'green', 'pink', 'purple']
    for (var x = 0; x < columns; x++) {
        for (var y = 0; y < rows; y++) {
            if (!state.alternatingBlocks || (x + y) % 2) {
                var nextColor = blockColors[Math.floor(Math.random() * blockColors.length)]
                newBlocks.push(new Block(new Victor(col1X + x * width, row1Y + y * height), width, height, nextColor, 1))
            }
        }
    }
    return newBlocks
}

function detectLevelEnd() {
    if (state.blocks.length < 1) {
        state.alternatingBlocks = !state.alternatingBlocks
        state.blocks = initializeBlocks(numBlockColumns, numBlockRows, topPadding, 50, blockWidth, blockHeight)
        state.balls = []
        addBallToPaddle()
        state.level ++
    }
}

function deleteBlocksWithNoHealth() {
    if (state.blocks.length > 0) {
        for (let i = state.blocks.length - 1; i >= 0; i--) {
            if (state.blocks[i].health < 1) {
                state.points += 100
                state.blocks.splice(i, 1)
            }
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
    state.paddle.draw(ctx)
    for (var block of state.blocks) {
        block.draw(ctx)
    }
    for (var ball of state.balls) {
        ball.draw(ctx)
    }
    ctx.font = '20px Arial'
    ctx.fillText('Lives: ' + state.ballStockpile + ' | Blocks left: ' + state.blocks.length, 10, 30)
    ctx.fillText('Score: ' + state.points, 850, 30)
    ctx.fillText('Level: ' + state.level, 480, 30)
}

function addBallToPaddle() {
    state.balls.push(new Ball(new Victor(state.paddle.position.x + paddleWidth / 2, state.paddle.position.y - defaultBallRadius), getNewBallSpeed(state.level), 'purple', defaultBallRadius, true))
}

function releaseBall() {
    let stuckBalls = state.balls.filter(ball => ball.isStuckToPaddle)
    if (stuckBalls !== null && stuckBalls !== undefined && stuckBalls.length > 0) {
        stuckBalls[0].isStuckToPaddle = false
    }
}

window.addEventListener('keydown', (key) => {
    if (leftKeys.includes(key.code)) {
        state.left = true
    } else if (rightKeys.includes(key.code)) {
        state.right = true
    } else if (releaseBallKeys.includes(key.code)) {
        releaseBall()
    }
})

window.addEventListener('keyup', (key) => {
    if (leftKeys.includes(key.code)) {
        state.left = false
    } else if (rightKeys.includes(key.code)) {
        state.right = false
    }
})

;(function () {
    function main(tFrame) {
        window.requestAnimationFrame(main)
        update(tFrame)
        draw()
    }
    main()
})()
