//store cells
cellStorage={};

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
    var html="<table class='bg-dark text-white'>";
    for (i = 0; i < height; i++){
        html += "<tr>";
        for (j = 0; j < width; j++){
            html += "<td class='text-center' id="+j+"_"+i+"><button onclick='checkIfMine(" + j +","+ i +")' class='cell-btn'></button></td>";
            cellStorage[String(j)+'_'+String(i)] = new cell(j,i);
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
    var arrXY = [];
    var i = 0;
    while(i < n){
        x = randomIntFromInterval(0, width-1);
        y = randomIntFromInterval(0, height-1);
        //prevent double assignment
        if(!arrXY.includes(String(x)+'_'+String(y))){
            i++;
            arrXY.push(String(x)+'_'+String(y));
            cellStorage[String(x)+'_'+String(y)].mine = true;
            //set counters of adjacent cells
            for(j = y-1; j < y+2 ; j++){
                for(k = x-1; k < x+2; k++){
                    //limit values to grid
                    if(k >= 0 && k<width){
                        if(j >= 0 && j<height){
                            //no counter increasing for the mine itself
                            if(!(k == x && j == y)){
                                cellStorage[String(k)+'_'+String(j)].counter += 1;
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
    if(cellStorage[String(x)+'_'+String(y)]['mine']){
        document.getElementById('gameMessage').innerHTML = "<h5 class='silkscreen text-center text-danger p-3'>You clicked on a mine. Game lost.</h5>";
        revealAllCells();
    } else {
        revealCells(x,y);
    }

}

//revealing cells
function revealCells (x,y){
    //check if cell is a 0
    if(cellStorage[String(x)+'_'+String(y)]['counter']==0){
        //reveal adjacent cells
        for(let i = y-1; i < y+2 ; i++){
            for(let j = x-1; j < x+2; j++){
                //limit values to grid
                if(j >= 0 && j<width){
                    if(i >= 0 && i<height){
                        var id = String(j)+'_'+String(i);
                        //check if cell already revealed
                        if(!cellStorage[id]['revealed']){
                            if(cellStorage[id]['counter']>0){
                                document.getElementById(id).innerHTML = cellStorage[id]['counter'];
                            } else{
                                document.getElementById(id).innerHTML = "";

                                //recursion: delay to prevent "Maximum call stack size exceeded" error
                                setTimeout(function (){
                                    revealCells(j,i);      
                                }, 250);
                                
                            }
                            cellStorage[id].revealed = true;
                            Game_Counter = Game_Counter - 1;
                        }
                    }
                }
            }
        }
    }else{
        //cells > 0 => only reveal cell itself
        document.getElementById(String(x)+'_'+String(y)).innerHTML = cellStorage[String(x)+'_'+String(y)]['counter'];
        cellStorage[String(x)+'_'+String(y)].revealed = true;
        Game_Counter = Game_Counter - 1;
    }
    //check if game is won
    if(Game_Counter == n){
        document.getElementById('gameMessage').innerHTML = "<h5 class='text-center silkscreen text-success p-3'>Well done! Game won.</h5>";
        revealAllCells();
    }
}

//revealing all cells
function revealAllCells(){
   for(const key in cellStorage){
        if(!cellStorage[key]['revealed']){
            if(cellStorage[key]['mine']){
                document.getElementById(String(key)).innerHTML = '<img src="img/explosion.png" width="25px" height="25px"/>';
            }else{
                if(cellStorage[key]['counter']>0){
                    document.getElementById(String(key)).innerHTML = cellStorage[key]['counter'];
                }else{
                    document.getElementById(String(key)).innerHTML = '';
                }
            }
        }
   }
}

//start Game
document.getElementById('startGame').addEventListener('click',function(){
    width = parseInt(document.getElementById('width').value);
    height = parseInt(document.getElementById('height').value);
    n = parseInt(document.getElementById('numberOfMines').value);
    var errorMessage = document.getElementById('errorMessage');
    errorMessage.innerText = '';
    document.getElementById('gameMessage').innerHTML='';
    if(isNaN(width)|| isNaN(height) || isNaN(n) ){
        errorMessage.innerText = 'Only integers are accepted as inputs.'
    }else{
        //count cells that are not revealed yet
        Game_Counter = width*height;

        //check for min and max values
        if(width > 0 && width <= 24){
            if(height > 0 && height <= 30){
                createGrid(width, height);
            }else{
                errorMessage.innerText = 'Height should be an integer between 1 and 30.'
            }
            if(n < 0 || n > (width * height)/5){
                n=Math.round((width * height)/5);
                document.getElementById('numberOfMines').value = n;
                errorMessage.innerText = 'Number of Mines was set to '+ n +'.'
            }
            assignMines(n, width, height);
        }else{
            errorMessage.innerText = 'Width should be an integer between 1 and 24.'
        }
        
    }
});