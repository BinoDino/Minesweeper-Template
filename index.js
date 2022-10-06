//store cells
CellStorage={};

//class for cells
function cell(x,y){
        this.x = x;
        this.y = y;
        this.mine = false;
        this.cell_counter = 0;
};

// create grid
function createGrid(width, height){
    html="";
    for (i = 0; i < height; i++){
        html += "<tr>";
        for (j = 0; j < width; j++){
            html += "<td><button class='cell-btn'></button></td>";
            CellStorage[String(j)+'_'+String(i)] = new cell(j,i);
        }
        html += "</tr>";
    }
    document.getElementById('gameContainer').innerHTML = html;
}


document.getElementById('startGame').addEventListener('click',function(){
    width = document.getElementById('width').value;
    height = document.getElementById('height').value;
    //Opened cells counter
    Game_Counter = width*height;
    createGrid(width, height);
});