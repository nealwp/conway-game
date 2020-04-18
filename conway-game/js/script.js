
// runs conways game of life

/***** declare variables *****/

var doc = document
var docBody = document.body
const cols = 75;
const cellCount = 1000;
const rows = cols;
var mouseIsDown = false;
var startIsClicked = false;
var btnStart = doc.getElementById('start');
var btnStop = doc.getElementById('stop');
var btnReset = doc.getElementById('reset');
var btnRandom = doc.getElementById('random');

/******** add event listeners *******/

btnStart.addEventListener('click', startEvents);
btnStop.addEventListener('click', function(){startIsClicked = false});
btnReset.addEventListener('click', resetGrid);
btnRandom.addEventListener('click', randomizeGrid)
addEventListener('mousedown', function(){mouseIsDown = true});
addEventListener('mouseup', function(){mouseIsDown = false});

/********  main *********/

var cells = generateCells();
var grid = defineGrid();

/********* end main **********/

/********* html generation functions *********/

function generateCells(){
    for (let y = 0; y < rows; y++){
        var row = doc.createElement('div');
        row.setAttribute('class', 'row');
        docBody.appendChild(row);
        for (let x = 0; x < cols; x++){
            let cell = doc.createElement('div');
            cell.textContent = 0;
            cell.setAttribute('class', 'cell');
            row.appendChild(cell);
        }
    }
    
    var cells = doc.querySelectorAll('.cell');

    for (let i = 0; i < cells.length; i++)
    {
        cells[i].addEventListener('mouseover', cellDrag);
        cells[i].addEventListener('click', cellClick);
    }

    return cells;

}

function defineGrid(){
    var grid = [];

    for (let y = 0; y < rows; y++){
        grid[y] = [];
        for (let x = 0; x < cols; x++){
            grid[y][x] = {
                cellRef: cells[(y*rows) + x],
                y: y,
                x: x,
                alive: 0
            }
        }
    }

    return grid;
}

/******* action functions ******/

//clear the grid
function resetGrid(){
    startIsClicked = false;
    for (let y = 0; y < rows; y++){
        for(let x = 0; x < cols; x++){
            grid[y][x].alive = 0;
            kill(grid[y][x].cellRef)
        }
    }
}

// trigger event loop start
function startEvents(){
    if (!startIsClicked){
        startIsClicked = true;
        eventLoop(0);
    }
}

// run until stop clicked
function eventLoop(i){
    if (startIsClicked){
        readGrid();
        repaintGrid();
        if (true){
            setTimeout('eventLoop(' + (i+1) + ')', 95);
        }
    }
}

// paint on grid
function cellDrag(){
    if(mouseIsDown){
        if (this.textContent == 0){
            resurrect(this);
        }
    }
}

function cellClick(){
    if (this.textContent == 0){
        resurrect(this);
    } else {
        kill(this);
    }
}

//set cell dead
function kill(cell){
    cell.textContent = 0;
    cell.style.backgroundColor = "#e1e1e1";
    cell.style.color = "#e1e1e1";
}

//set cell alive
function resurrect(cell){
    cell.textContent = 1;
    cell.alive = 1;
    cell.style.backgroundColor = "#00008F";
    cell.style.color = "#00008F";
} 


function countNeighbors(cell){
    total = 0;
    //check Northwest
    if (cell.x != 0 & cell.y != 0){
        total +=Number(grid[cell.y-1][cell.x-1].cellRef.textContent)
    }
    //check North
    if (cell.y != 0){
        total +=Number(grid[cell.y-1][cell.x].cellRef.textContent)
    }
    //check Northeast
    if (cell.x != cols-1 & cell.y != 0){
        total +=Number(grid[cell.y-1][cell.x+1].cellRef.textContent)
    }
    //check East
    if (cell.x != cols-1){
        total += Number(grid[cell.y][cell.x+1].cellRef.textContent)
    }
    //check Southeast
    if (cell.x != cols-1 & cell.y != rows-1){
        total += Number(grid[cell.y+1][cell.x+1].cellRef.textContent)
    }
    //check South
    if (cell.y != rows-1){
        total +=Number(grid[cell.y+1][cell.x].cellRef.textContent)
    }
    //check Southwest
    if (cell.x != 0 & cell.y != rows-1){
        total += Number(grid[cell.y+1][cell.x-1].cellRef.textContent)
    }
    //check West
    if (cell.x != 0){
        total += Number(grid[cell.y][cell.x-1].cellRef.textContent)
    }

    return total;
}

//check neighbors and set state
function readGrid(){
    for (let y = 0; y < rows; y++){
        for (let x = 0; x < cols; x++){
            if (grid[y][x].cellRef.textContent == 1) {
                if (countNeighbors(grid[y][x]) > 3){
                    grid[y][x].alive = 0;
                } else if (countNeighbors(grid[y][x]) < 2){
                    grid[y][x].alive = 0;
                } else if (countNeighbors(grid[y][x]) == 2 || countNeighbors(grid[y][x]) == 3){ 
                    grid[y][x].alive = 1;
                }
            } else if (countNeighbors(grid[y][x], grid) == 3){
                grid[y][x].alive = 1;
            }
        } 
    }
}

// render grid based on state
function repaintGrid(){
    for (let y = 0; y < rows; y++){
         for (let x = 0; x < cols; x++){
             if (grid[y][x].alive == 0){
                 kill(grid[y][x].cellRef);
             } else {
                 resurrect(grid[y][x].cellRef); 
             }
         }
     }
 }

 function randomizeGrid(){
    resetGrid(); 
    for (let y = 0; y < rows; y++){
         for (let x = 0; x < cols; x++){
             if (1 == Math.round(Math.random())){
                resurrect(grid[y][x].cellRef);
             } 
         }
     }
 }