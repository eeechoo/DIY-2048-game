var board = new Array()
var score = 0

 $(document).ready(function () {
     newgame()
 })

function newgame() {
    //初始化棋盘格
    init()
    //在随机两个格子生成数字
    generateOneNumber()
    generateOneNumber()
}

function init() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var gridCell = $('#grid-cell-' + i + '-' + j)
            gridCell.css('top', getPosTop(i, j))
            gridCell.css('left', getPosLeft(i, j))
        }
    }

    for (var i = 0; i < 4; i++) {
        board[i] = new Array()
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0
        }
    }
    updateBoardView()
}

function updateBoardView() {
    $('.number-cell').remove()
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $('#grid-container').append(`<div class="number-cell" id="number-cell-${i}-${j}"></div>`)
            var theNumberCell = $(`#number-cell-${i}-${j}`)

            if (board[i][j] === 0) {
                theNumberCell.css('width', '0px')
                theNumberCell.css('height', '0px')
                theNumberCell.css('top', getPosTop(i, j) + 50)
                theNumberCell.css('left', getPosLeft(i, j) + 50)
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]))
                theNumberCell.css('color', getNumberColor(board[i][j]))
            } else {
                theNumberCell.css('width', '100px')
                theNumberCell.css('height', '100px')
                theNumberCell.css('top', getPosTop(i, j))
                theNumberCell.css('left', getPosLeft(i, j))
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]))
                theNumberCell.css('color', getNumberColor(board[i][j]))
                theNumberCell.text( board[i][j] )
            }
        }
    }
}

//在数是0的位置，也就是空着的暂时没有数的位置产生一个随机是2或4的数字
//直接在页面中将随机出来的数字显示出来
function generateOneNumber() {
    if(nospace(board)) {
        return false
    }

    //随机一个位置
    var randx = parseInt(Math.floor(Math.random() * 4))
    var randy = parseInt(Math.floor(Math.random() * 4))

    while (true) {
        if (board[randx][randy] === 0) {
            break
        }
        var randx = parseInt(Math.floor(Math.random() * 4))
        var randy = parseInt(Math.floor(Math.random() * 4))
    }

    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4

    //在随机位置显示随机数字
    board[randx][randy] = randNumber
    showNumberWithAnimation(randx, randy, randNumber)
    return true
}

//游戏根据用户产生的按键事件运行
$(document).keydown(function (event) {
    switch (event.keyCode) {
        case 37: //left
            if (moveLeft()) {
                setTimeout("generateOneNumber()", 1200)
                setTimeout("isgameover()", 2200)
            }
            break
        case 38: //up
            if (moveUp()) {
                setTimeout("generateOneNumber()", 1200)
                setTimeout("isgameover()", 2200)
            }
            break
        case 39: //right
            if (moveRight()) {
                setTimeout("generateOneNumber()", 1200)
                setTimeout("isgameover()", 2200)
            }
            break
        case 40: //down
            if (moveDown()) {
                setTimeout("generateOneNumber()", 1200)
                setTimeout("isgameover()", 2200)
            }
            break
        default:
            break
    }
})

function isgameover() {
    if(nospace(board) && nomove(board))
        gameover()
}

function gameover() {
    alert("gameover!")
}

function moveLeft() {
    if (!canMoveLeft(board)) {
        return false
    }

    //move left
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] !== 0) {
                for (var k = 0; k < j; k++) {
                    if (board[i][k] === 0 && noBlockHorizontal(i, k, j, board)) {
                        //move
                        showMoveAnimation(i, j, i, k)
                        board[i][k] = board[i][j]
                        board[i][j] = 0
                        break
                    } else if (board[i][k] === board[i][j] && noBlockHorizontal(i, k, j, board)) {
                        //move
                        showMoveAnimation(i, j, i, k)
                        //add
                        board[i][k] += board[i][j]
                        board[i][j] = 0
                        //add score
                        score += board[i][k]
                        updateScore(score)
                        break
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 1000)
    return true
}

function moveRight() {
    if (!canMoveRight(board)) {
        return false
    }

    //move right
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] !== 0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k] === 0 && noBlockHorizontal(i, j, k, board)) {
                        //move
                        showMoveAnimation(i, j, i, k)
                        board[i][k] = board[i][j]
                        board[i][j] = 0
                        break
                    } else if (board[i][k] === board[i][j] && noBlockHorizontal(i, j, k, board)) {
                        //move
                        showMoveAnimation(i, j, i, k)
                        //add
                        board[i][k] += board[i][j]
                        board[i][j] = 0
                        //add score
                        score += board[i][k]
                        updateScore(score)
                        break
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 1000)
    return true
}

function moveUp() {
    if (!canMoveUp(board)) {
        return false
    }

    //move up
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[j][i] !== 0) {
                for (var k = 0; k < j; k++) {
                    if (board[k][i] === 0 && noBlockVertical(i, k, j, board)) {
                        //move
                        showMoveAnimation(j, i, k, i)
                        board[k][i] = board[j][i]
                        board[j][i] = 0
                        break
                    } else if (board[k][i] === board[j][i] && noBlockVertical(i, k, j, board)) {
                        //move
                        showMoveAnimation(j, i, k, i)
                        //add
                        board[k][i] += board[j][i]
                        board[j][i] = 0
                        //add score
                        score += board[k][i]
                        updateScore(score)
                        break
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 1000)
    return true
}

function moveDown() {
    if (!canMoveDown(board)) {
        return false
    }

    //move down
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {
            if (board[j][i] !== 0) {
                for (var k = 3; k > j; k--) {
                    if (board[k][i] === 0 && noBlockVertical(i, k, j, board)) {
                        //move
                        showMoveAnimation(j, i, k, i)
                        board[k][i] = board[j][i]
                        board[j][i] = 0
                        break
                    } else if (board[k][i] === board[j][i] && noBlockVertical(i, k, j, board)) {
                        //move
                        showMoveAnimation(j, i, k, i)
                        //add
                        board[k][i] += board[j][i]
                        board[j][i] = 0
                        //add score
                        score += board[k][i]
                        updateScore(score)
                        break
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 1000)
    return true
}
