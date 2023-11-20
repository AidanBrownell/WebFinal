let currentBoard = Array.from({ length: 7 }, () => Array(7).fill(' '));
let turn = 0;
let but0 = ' ';
let but1 = ' ';
let but2 = ' ';
let but3 = ' ';
let but4 = ' ' ;
let but5 = ' ';
let but6 = ' ';





const renderBoard = () => {
    const boardDiv = document.getElementById('board');
    boardDiv.innerHTML = ''; // clear the board

    // TODO: Render the board to the DOM, each row should be a div,
    //       and each cell should be a div inside that row div.
    //       Each cell should have a class of 'cell' and the text
    //       content should be the character at that position in the board.
    


     for (let i = 0; i < 6; i++) {
          const rowDiv = document.createElement('div');
          rowDiv.className = "row";
          for (let j = 0; j < 7; j++) {
              const cellDiv = document.createElement('div');
              cellDiv.className = 'cell';
              //let currDiv = cellDiv[j];
              
              const cellSpan = document.createElement('span');
              cellSpan.className='span' + i + j;
              cellSpan.appendChild(document.createTextNode(currentBoard[i][j]));
            
              //const cellText = document.createTextNode(currentBoard[i][j]);
              //cellDiv.textConent = currentBoard[y][x];
              cellDiv.appendChild(cellSpan);
              rowDiv.appendChild(cellDiv);
              
              //cellDiv.textConent = currentBoard[y][x];
              
              }
          boardDiv.appendChild(rowDiv);
          }
          const rowDiv = document.createElement('div');
          for (let i = 0; i < 7; i++) {
            const cellDiv = document.createElement('div');
            cellDiv.className = "cellB";
            const newbutton = document.createElement('button');
            newbutton.className="button" + i;
            newbutton.textContent=i;
            cellDiv.appendChild(newbutton)
            rowDiv.appendChild(cellDiv);
            
          }
          boardDiv.appendChild(rowDiv);
          //boardID.innerHTML = currentBoardID;


        but0 = document.getElementsByClassName('button0');
        but1 = document.getElementsByClassName('button1');
        but2 = document.getElementsByClassName('button2');
        but3 = document.getElementsByClassName('button3');
        but4 = document.getElementsByClassName('button4');
        but5 = document.getElementsByClassName('button5');
        but6 = document.getElementsByClassName('button6');
        
        createEvents();



};

renderBoard();

function checkHorizontal(row, col, myval) {
    let count = 0;
    let i = row;
    let j = col;
    for (j; j < 7; j++) {
        let val = document.getElementsByClassName('span' + i + j)[0].style.getPropertyValue("color");
        if (count == 4) {
            return true;
        }
        else if (val != myval) {
            count = 0;
        }
        else {

            count++;
        }
    }
    count = 0;
    j = col;
    for (j; j >= 0; j--) {
        let val = document.getElementsByClassName('span' + i + j)[0].style.getPropertyValue("color");
        if (count == 4) {
            return true;
        }
        else if (val != myval) {
            count = 0;
        }
        else {
            count++;
        }
    }
    return false;
}

function checkVertical(row, col, myval) {
    let count = 0;
    for (let i = 5; i >= 0; i--) {
        let val = document.getElementsByClassName('span' + i + col)[0].style.getPropertyValue("color");
        if (count == 4) {
            return true;
        }
        else if (val != myval) {
            count = 0;
        }
        else {
            count++;
        }
    }
    return false;
}

function checkDiagonal(row, col, myval) {
    let count = 0;
    let i = row;
    let j = col;
    while (i < 6 && j >= 0) {
        let val = document.getElementsByClassName('span' + i + j)[0].style.getPropertyValue("color");
        if (val != myval) {
            i--;
            j++;
            break;
        }
        else {
            i++;
            j--;
            if (i > 5 || j < 0) {
                i--;
                j++;
                break;
            }
        }

    }
    count = 0
    while (i >= 0 && j < 7) {
        let val = document.getElementsByClassName('span' + i + j)[0].style.getPropertyValue("color");
            if (count == 4) {
                return true;
            }
            else if (val != myval) {
                count = 0;
            }
            else {
                count++;
            }
            if (count == 4) {
                return true;
               }
            i--;
            j++;
    }

    i = row;
    j = col;

    while (i >= 0 && j >= 0) {
        let val = document.getElementsByClassName('span' + i + j)[0].style.getPropertyValue("color");
        if (val != myval) {
            i++;
            j++;
            break;
        }
        else {
            i--;
            j--;
            if (i < 0 || j < 0) {
                i++;
                j++;
                break;
            }
        }
    }
    count = 0;
   while (i < 6 && j < 7) {
       let val = document.getElementsByClassName('span' + i + j)[0].style.getPropertyValue("color");
           if (count == 4) {       
               return true;
           }
           else if (val != myval) {
               count = 0;
           }
           else {
               count++;
           }
           if (count == 4) {
            return true;
           }

           i++;
           j++;
    }
        return false;
}


function checkWin(i, j) {
    let val = document.getElementsByClassName('span' + i + j)[0].style.getPropertyValue("color");
    if (val == 'red' && turn == 0)
    {
        if (checkHorizontal(i, j, val) || checkVertical(i, j, val) || checkDiagonal(i, j, val)) {;
                return true;
        }
    }
    else if (val == 'blue' && turn == 1)
    {
        if (checkHorizontal(i, j, val) || checkVertical(i, j, val) || checkDiagonal(i, j, val)) {
                return true;
        }
    }

    return false;
}

function drop(col) {
    
    

    for (let i = 5; i >= 0; i--) {
        if (currentBoard[i][col] == ' ') {
            currentBoard[i][col] = 'O';
            if (turn == 0){
                const cellSpan = document.getElementsByClassName('span' + i + col)[0];
                cellSpan.style.color = 'red';
                let txt = document.createTextNode(currentBoard[i][col]);
                cellSpan.appendChild(txt);
                
            }
            else{
                const cellSpan = document.getElementsByClassName('span' + i + col)[0];
                cellSpan.style.color = 'blue';
                let txt = document.createTextNode(currentBoard[i][col]);
                cellSpan.appendChild(txt);
            }
            if (checkWin(i, col))
            {
                alert('win');
            }
            //renderBoard();
            if (turn == 0) {
                turn = 1;
            }
            else {turn = 0;}
            break;
        }

    }
    
}

function createEvents() {
but0[0].addEventListener('click', function() 
{
    drop(0);
});

but1[0].addEventListener('click', function() 
{
    drop(1);
});

but2[0].addEventListener('click', function() 
{
    drop(2);
});


but3[0].addEventListener('click', function() 
{
    drop(3);
});


but4[0].addEventListener('click', function() 
{
    drop(4);
});

but5[0].addEventListener('click', function() 
{
    drop(5);
});


but6[0].addEventListener('click', function() 
{
    drop(6);
});

}