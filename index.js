//store cells
CellStorage={};

//constructing cells
function cell(x,y){
        this.x = x;
        this.y = y;
        this.mine = false;
        this.counter = 0;
};

// create grid + corresponding cells
function createGrid(width, height){
    html="";
    for (i = 0; i < height; i++){
        html += "<tr>";
        for (j = 0; j < width; j++){
            html += "<td><button onclick='checkIfMine(" + j +","+ i +")' class='cell-btn'></button></td>";
            CellStorage[String(j)+'_'+String(i)] = new cell(j,i);
        }
        html += "</tr>";
    }
    document.getElementById('gameContainer').innerHTML = html;
}

//randomisation function
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

//assign mines to cells
function assignMines(n, width, height){
    var arrX = [];
    var arrY = [];
    i = 0;
    while(i < n){
        x = randomIntFromInterval(0, width-1);
        y = randomIntFromInterval(0, height-1);
        //prevent double assignment
        if(!arrX.includes(x) && !arrY.includes(y)){
            i++;
            arrX.push(x);
            arrY.push(y);
            CellStorage[String(x)+'_'+String(y)].mine = true;
            //set counters of adjacent cells
            for(j = y-1; j < y+2 ; j++){
                for(k = x-1; k < x+2; k++){
                    //limit values to grid
                    if(k >= 0 && k<width){
                        if(j >= 0 && j<height){
                            //no counter increasing for the mine itself
                            if(!(k == x && j == y)){
                                CellStorage[String(k)+'_'+String(j)].counter += 1;
                            }
                        }
                    }
                }
                
            }
        }
    }
}

function checkIfMine(x,y){
    if(CellStorage[String(x)+'_'+String(y)]['mine']){
        gameContainer = document.getElementById('gameContainer');
        gameContainer.classList.remove('bg-dark');
        gameContainer.classList.add('bg-danger');
        gameContainer.innerHTML = "<p class='text-center p-3'>You clicked on a mine. Game lost.</p>";
    }

}

document.getElementById('startGame').addEventListener('click',function(){
    width = document.getElementById('width').value;
    height = document.getElementById('height').value;
    //Opened cells counter
    Game_Counter = width*height;
    createGrid(width, height);
    assignMines(document.getElementById('numberOfMines').value, width, height);
});