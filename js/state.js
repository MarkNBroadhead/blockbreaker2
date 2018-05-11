function detectLevelEnd(blocks, state, balls) {
    if (blocks.length < 1) {
        state.alternatingBlocks = !state.alternatingBlocks
        blocks = initializeBlocks(numBlockColumns, numBlockRows, xPadding, 50, blockWidth, blockHeight)
        balls = []
        addBallToPaddle()
        releaseBall()
    }
}

module.exports detectLevelEnd