var html = $('#maze')

function Cell(I, J){
    this.i = I;
    this.j = J;
    this.visited = false;
    this.start = false;
    this.end = false;
    this.path = false;
    this.correct_path = false;
    this.walls = {
      n: true,
      s: true,
      e: true,
      w: true
    };
    
    this.print = function(){
      return '<div id="cell_' + this.i +'_'+ this.j + '" data-solution="' + this.correct_path + '" data-west="' + this.walls.w + '" data-east="' + this.walls.e + '" data-north="' + this.walls.n + '" data-south="' + this.walls.s + '" class="cell" data-start="' + this.start + '" data-end="' + this.end + '" data-visited="' + this.visited + '"></div>'
    }
}

var maze = {
  height: 35,
  width: 35,
  visited_cells: []
}

maze.init = function() {
  maze.cells = [[]];
  
  for(i = 0; i < this.width; i++) {
    maze.cells[i] = [];
    for(j = 0; j < this.height; j++) {
      maze.cells[i][j] = new Cell(i, j);
    }
  }
  
  maze.cells[0][0].start = true;
  maze.cells[this.width - 1][this.height - 1].end = true;
  maze.cells[this.width - 1][this.height - 1].walls.e = false;
  maze.cells[0][0].walls.w = false
}

maze.print = function() {
  var new_html = ''
  
  for(i = 0; i < this.width; i++) {
    for(j = 0; j < this.height; j++) {
      new_html += this.cells[i][j].print()
    }
    new_html += '<br style="clear: both"/>'
  }
  
  html.html(new_html)
}

maze.print_solution = function() {
  setTimeout(function(){
      var cell = maze.solution_copy.pop()
      document.getElementById('cell_' + cell.i + '_' + cell.j).setAttribute('data-solution', "true");
     
      if(maze.solution_copy.length != 0) maze.print_solution();
      else {
        $('#solve').text("solved").addClass('disabled')
        $('#regen').removeClass('disabled')
      }
  }, 50)
}

function RandomUniqueNumber(len){
  this.numbers = [];
  
  for(x = 0; x < len; x++) this.numbers[x] = x;
  
  this.get = function() {
    var i = Math.ceil(Math.random()*(this.numbers.length)) - 1;
    return this.numbers.splice(i, 1)[0]
  }
}

maze.mazifiy = function(i, j) {
  maze.visited_cells.push(maze.cells[i][j]);

  maze.cells[i][j].visited = true;
  var invalid = true
  var randomGen = new RandomUniqueNumber(4);
  var counter = 0

  while(invalid && counter < 4){
    invalid = false
    counter ++
    var randomSide = randomGen.get();

    if(randomSide == 0 && i > 0 && !maze.cells[i - 1][j].visited) {
      maze.cells[i][j].walls.n = false;
      maze.cells[i - 1][j].walls.s = false
      maze.mazifiy(i - 1, j)
    }
    else if(randomSide == 1 && i < maze.height - 1 && !maze.cells[i + 1][j].visited) {
      maze.cells[i][j].walls.s = false;
      maze.cells[i + 1][j].walls.n = false
      maze.mazifiy(i + 1, j)
    }
    else if(randomSide == 2 && j < maze.width - 1 && ! maze.cells[i][j + 1].visited) {
      maze.cells[i][j].walls.e = false;
      maze.cells[i][j + 1].walls.w = false
      maze.mazifiy(i, j + 1)
    }
    else if(randomSide == 3 && j > 0 && !maze.cells[i][j - 1].visited) {
      maze.cells[i][j].walls.w = false;
      maze.cells[i][j - 1].walls.e = false
      maze.mazifiy(i, j - 1)
    } else {
      invalid = true
    }
  }

  // Dead end
  maze.visited_cells.pop()
  var last = maze.visited_cells.pop()
  if(last != undefined) maze.mazifiy(last.i, last.j)
}

maze.solve = function(i, j) {  
  var cell = maze.cells[i][j];
  
  if(cell.end) return true
  if(cell.path) return false
  
  cell.path = true
  
  if(i > 0 && !cell.walls.n) {
    if(maze.solve(i - 1, j)) {
      maze.solution.push(cell);
      return true;
    }
  }
  
  if(i < maze.height - 1 && !cell.walls.s) {
    if(maze.solve(i + 1, j)) {
      maze.solution.push(cell);
      return true;
    }
  }
  
  if(j > 0 && !cell.walls.w) {
    if(maze.solve(i, j - 1)) {
      maze.solution.push(cell);
      return true;
    }
  }
  
  if(j < maze.width - 1 && !cell.walls.e) {
    if(maze.solve(i, j + 1)) {
      maze.solution.push(cell);
      return true;
    }
  }
  
  return false;
}

maze.visited_cells = [];
maze.solution = [];
maze.init()
maze.mazifiy(0, 0);
maze.print()

$('#regen').click(function(){
  $('#solve').text("solve").removeClass('disabled')
  $(this).addClass('disabled')
  maze.visited_cells = [];
  maze.solution = [];
  maze.init()
  maze.mazifiy(0, 0);
  maze.print()
  $(this).removeClass('disabled')
})

$('#solve').click(function(){
  $(this).text("solving...").addClass('disabled')
  $('#regen').addClass('disabled')
  maze.solution = [];
  maze.solve(0,0);
  maze.solution_copy = maze.solution.concat([])
  maze.print_solution()
})