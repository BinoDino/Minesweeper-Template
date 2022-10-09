//store cells
CellStorage={};

//constructing cells
function cell(x,y){
        this.x = x;
        this.y = y;
        this.mine = false;
        this.counter = 0;
        this.revealed = false;
};

// create grid + corresponding cells
function createGrid(width, height){
    html="<table class='bg-dark text-white'>";
    for (i = 0; i < height; i++){
        html += "<tr>";
        for (j = 0; j < width; j++){
            html += "<td class='text-center' id="+j+"_"+i+"><button onclick='checkIfMine(" + j +","+ i +")' class='cell-btn'></button></td>";
            CellStorage[String(j)+'_'+String(i)] = new cell(j,i);
        }
        html += "</tr>";
    }
    html+="</table>";
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

//check if cell is a mine
function checkIfMine(x,y){
    gameContainer = document.getElementById('gameContainer');
    if(CellStorage[String(x)+'_'+String(y)]['mine']){
        gameContainer.classList.remove('bg-dark');
        gameContainer.classList.add('bg-danger');
        gameContainer.innerHTML = "<p class='text-center p-3'>You clicked on a mine. Game lost.</p>";
    } else {
        revealCells(x,y);
        if(Game_Counter == document.getElementById('numberOfMines').value){
            gameContainer.classList.remove('bg-dark');
            gameContainer.classList.add('bg-success');
            gameContainer.innerHTML = "<p class='text-center p-3'>Well done! Game won.</p>";
        }
    }

}

//revealing cells
function revealCells (x,y){
    //check if cell is a 0
    if(CellStorage[String(x)+'_'+String(y)]['counter']==0){
        //reveal adjacent cells
        for(let i = y-1; i < y+2 ; i++){
            for(let j = x-1; j < x+2; j++){
                //limit values to grid
                if(j >= 0 && j<width){
                    if(i >= 0 && i<height){
                        var id = String(j)+'_'+String(i);
                        //check if cell already revealed
                        if(!CellStorage[id]['revealed']){
                            if(CellStorage[id]['counter']>0){
                                document.getElementById(id).innerHTML = CellStorage[id]['counter'];
                            } else{
                                document.getElementById(id).innerHTML = "";

                                //recursion: delay to prevent "Maximum call stack size exceeded" error
                                setTimeout(function (){
                                    revealCells(j,i);      
                                }, 250);
                                
                            }
                            CellStorage[id].revealed = true;
                            Game_Counter = Game_Counter - 1;
                        }
                    }
                }
            }
        }
    }else{
        //cells > 0 => only reveal cell itself
        document.getElementById(String(x)+'_'+String(y)).innerHTML = CellStorage[String(x)+'_'+String(y)]['counter'];
        CellStorage[String(x)+'_'+String(y)].revealed = true;
        Game_Counter = Game_Counter - 1;
    }
}

document.getElementById('startGame').addEventListener('click',function(){
    width = document.getElementById('width').value;
    height = document.getElementById('height').value;
    //Count cells that are not revealed yet
    Game_Counter = width*height;
    createGrid(width, height);
    assignMines(document.getElementById('numberOfMines').value, width, height);
});