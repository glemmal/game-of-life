var gameOfLife = (function () {
  
  var $canvas = document.getElementsByTagName('canvas')[0]
  var $button = document.getElementsByTagName('button')[0]
  var $image = new window.Image()
  
  var width = $canvas.offsetWidth
  var amountBoxesPerLine = 150
  var amountBoxesPerColumn = 90 
  var boxWidth = width / amountBoxesPerLine
  var boxHeight = boxWidth
  var height = boxWidth * amountBoxesPerColumn
  var currentMaze = []
  var ctx = $canvas.getContext('2d')
  var clicking = false

  $canvas.width = $canvas.offsetWidth
  $canvas.height = height

  $canvas.addEventListener('mousedown', function() {
    clicking = true
  })

  $canvas.addEventListener('mouseup', function (event) {
    clicking = false
    clickMaze(event)
  })

  $canvas.addEventListener('mousemove', function (event) {
    if (clicking) clickMaze(event)
  })

  $button.addEventListener('click', function (event) {
    setInterval(function () {
      currentMaze = liveStep(currentMaze)
      draw(currentMaze)
    }, 100)
  })

  var clickMaze = function (event) {
    var offX = Math.floor(event.offsetX)
    var offY = Math.floor(event.offsetY)
    var x = Math.floor(offX / boxWidth)
    var y = Math.floor(offY / boxHeight)
    currentMaze[x][y].alive = true
    currentMaze[x][y].active = true
    draw(currentMaze)
  }

  var neighbour = function (maze, x, y) {
    // randbehandlung
    if (maze[x] && maze[x][y]) return maze[x][y]
    return {
      active: false,
      alive: false
    }
  }

  var getNeighbours = function (maze, x, y) {
    return [
      neighbour(maze, x - 1, y - 1),
      neighbour(maze, x - 1, y),
      neighbour(maze, x - 1, y + 1),
      neighbour(maze, x, y - 1),
      neighbour(maze, x, y + 1),
      neighbour(maze, x + 1, y - 1),
      neighbour(maze, x + 1, y),
      neighbour(maze, x + 1, y + 1)
    ]
  }

  var deadOrAlive = function (maze, x, y) {

    var cell = maze[x][y]
    var neighbours = getNeighbours(maze, x, y)
    var alive = neighbours.reduce(function (a, b) {
      return a + b.alive
    }, 0)

    if (cell.alive && alive < 2) {
      cell.alive = false
    } else if (cell.alive && (alive === 2 || alive === 3)) {
      cell.alive = true
    } else if (cell.alive && alive > 3) {
      cell.alive = false
    } else if (!cell.alive && alive === 3) {
      cell.alive = true
      cell.active = true
    }

    return cell
  }

  var liveStep = function (maze) {
    var copy = maze.slice()
    for (var x = 0; x < amountBoxesPerLine; x++) {
      for (var y = 0; y < amountBoxesPerColumn; y++) {
        copy[x][y] = deadOrAlive(maze, x, y)
      }
    }
    return copy
  }

  var createMaze = function () {
    var maze = []
    for (var x = 0; x < amountBoxesPerLine; x++) {
      maze[x] = []
      for (var y = 0; y < amountBoxesPerColumn; y++) {
        maze[x][y] = {
          alive: false
        }
      }
    }
    return maze
  }

  var draw = function (maze) {
    for (var x = 0; x < maze.length; x++) {
      for (var y = 0; y < maze[x].length; y++) {
        var cell = maze[x][y]
        if (cell.alive) {
          ctx.fillStyle = '#F44336'
          ctx.fillRect(boxWidth * x, boxHeight * y, boxWidth, boxHeight)
        } else if(cell.active) {
          ctx.fillStyle = 'yellow'
          ctx.fillRect(boxWidth * x, boxHeight * y, boxWidth, boxHeight)
        }
      }
    }
  }

  currentMaze = createMaze()
  draw(currentMaze)
  
})

window.gameOfLife()