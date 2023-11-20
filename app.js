// TODO: Connect to the socket.io server
// (Hint: The HTML page has included the socket.io via a script tag,
//        so you can access the socket.io library in an object called `io`.
//        Use the io.connect function with the server URL and port, and
//        it will return a socket object that you can use to communicate.)
const socket = io.connect('http://localhost:4004');
let currentBoard = {boardID: null, boardSet: null, playerone: null, playertwo: null, currentTurn: null};
let currentBoardID = '';
let turn = null;


socket.on('update', (board) => {
    if (currentBoard) {
        // TODO: Update the character at the given x, y position on the board
        currentBoard = board;
        renderBoard();
    }
});

const renderWin = () => {
    const boardDiv = document.getElementById('board');
    boardDiv.innerHTML = ''; // clear the board
    const pageDiv = document.getElementById('stuff');
    pageDiv.innerHTML = '';
    const boardidDiv = document.getElementById('boardID');
    boardidDiv.innerHTML = '';
    pageDiv.style.backgroundColor = 'green';
    pageDiv.style.fontSize = "30pt";
    
    pageDiv.appendChild(document.createTextNode('YOU WIN'))

    const infoDiv = document.createElement('div');

    const n = document.createElement('label');
    n.setAttribute('for', 'command');
    n.textContent = "Enter your name:"

    const nameBar = document.createElement('input');
    nameBar.setAttribute('type', 'text');
    nameBar.setAttribute('id', 'nameTag');

    const lossButt = document.createElement('button');
    lossButt.setAttribute('id', 'setStats');
    lossButt.textContent="Submit"

    infoDiv.appendChild(n);
    infoDiv.appendChild(nameBar);
    infoDiv.appendChild(lossButt);

    pageDiv.append(infoDiv);

    document.getElementById('setStats').addEventListener('click', function() {
        console.log('adding stats')
        let m = document.getElementById('nameTag');
        let user = m.value;
        let val = {val1: user, val2: 'win'}

        socket.emit('updateStats', val, (response) => {
            console.log('done1');
        });

        console.log('done2');

        /*socket.emit('renderStats', (stats) => {
            renderStats(stats.maxPlayedPerson, stats.maxPlayed, stats.maxWinPerson, stats.maxWin, stats.maxLossPerson, stats.maxLoss)
        });*/
    
    });
}

const renderLoss = () => {
    const boardDiv = document.getElementById('board');
    boardDiv.innerHTML = ''; // clear the board
    const pageDiv = document.getElementById('stuff');
    pageDiv.innerHTML = '';
    const boardidDiv = document.getElementById('boardID');
    boardidDiv.innerHTML = '';
    pageDiv.style.backgroundColor = 'red';
    pageDiv.style.fontSize = "30pt";
    pageDiv.appendChild(document.createTextNode('YOU LOSE'));


    const infoDiv = document.createElement('div');

    const n = document.createElement('label');
    n.setAttribute('for', 'command');
    n.textContent = "Enter your name:"

    const nameBar = document.createElement('input');
    nameBar.setAttribute('type', 'text');
    nameBar.setAttribute('id', 'nameTag');

    const lossButt = document.createElement('button');
    lossButt.setAttribute('id', 'setStats');
    lossButt.textContent="Submit";

    infoDiv.appendChild(n);
    infoDiv.appendChild(nameBar);
    infoDiv.appendChild(lossButt);

    pageDiv.append(infoDiv);

    document.getElementById('setStats').addEventListener('click', function() {
        console.log('adding stats')
        let m = document.getElementById('nameTag');
        let user = m.value;
        let val = {val1: user, val2: 'loss'}

        socket.emit('updateStats', val, (response) => {
            console.log('done');
        });

        /*socket.emit('renderStats', (stats) => {
            renderStats(stats.maxPlayedPerson, stats.maxPlayed, stats.maxWinPerson, stats.maxWin, stats.maxLossPerson, stats.maxLoss)
        });*/
    
    });


}


socket.on('updateB', (board) => {
    currentBoard = board;
    console.log('turn = ' + turn + " p1 = " + currentBoard.playerone + " p2 = " + currentBoard.playertwo);
    if ((turn == 0 && currentBoard.playerone == 3) || (turn == 1 && currentBoard.playertwo == 3)) {
        renderWin();
        console.log('here 3');
    }
    else if ((turn == 1 && currentBoard.playertwo==-1) || (turn == 0 && currentBoard.playerone==-1))
    {
        renderLoss();
        console.log('here 3');
    }

    /*
    to do: 
        with a username thing so they can enter a username
        20 minutes
        then it will access a json that will update: games played, won, lost
        40 minutes
        develop a homescreen that, when opened, iterates through the json on the server and displays: most played, most won, most lost
        2-3 hours
        submit
    */
    console.log("HERE65")
})


socket.on('color', (board, i, col) => {
    currentBoard.boardID = board.boardID;
    currentBoard.boardSet = board.boardSet;
    currentBoard.playerone = board.playerone;
    currentBoard.playertwo = board.playertwo;
    currentBoard.currentTurn = board.currentTurn;
    currentBoardID = currentBoard.boardID;

    if (currentBoard.currentTurn == 0){
        const cellSpan = document.getElementsByClassName('span' + i + col)[0];
        cellSpan.style.color = 'red';
        let txt = document.createTextNode(currentBoard.boardSet[i][col]);
        cellSpan.appendChild(txt);
    }
    else{
        const cellSpan = document.getElementsByClassName('span' + i + col)[0];
        cellSpan.style.color = 'blue';
        let txt = document.createTextNode(currentBoard.boardSet[i][col]);
        cellSpan.appendChild(txt);
    }

    let boardDiv = document.getElementById('board');
    let trntxt = document.getElementById('trntxt');
    if (trntxt == null) {
        trntxt.setAttribute('id', 'trntxt');
        trntxt = document.createElement('div');
    }
    else {
        trntxt.innerHTML = '';
    }
    let para = document.createElement('p');
    if (currentBoard.currentTurn == 1) {
        para.style.color = 'red';
        para.textContent = "Player: " + 1 + "'s Turn";
    }
    else {
        para.style.color = 'blue';
        para.textContent = "Player: " + 2 + "'s Turn";
    }
        trntxt.appendChild(para);
        boardDiv.appendChild(trntxt);

    if (currentBoard.currentTurn == 0) {
        currentBoard.currentTurn = 1;
    }
    else {
        currentBoard.currentTurn = 0;
    }

    

});

function checkHorizontal(row, col, myval) {
    let count = 0;
    let i = row;
    let j = 0;
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
        if (count == 4) {
            return true;
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
        if (count == 4) {
            return true;
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
        if (count == 4) {
            return true;
           }
    }
    return false;
}

function checkDiagonal(row, col, myval) {
    let count = 0;
    let i = row;
    let j = col;
    while (i <= 6 && j >= 0) {
        let val = document.getElementsByClassName('span' + i + j)[0].style.getPropertyValue("color");
        if (val != myval) {
            i--;
            j++;
            break;
        }
        else {
            i++;
            j--;
            if (i > 6 || j < 0) {
                i--;
                j++;
                break;
            }
        }

    }
    if (i == 7) {
        i=6;
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
    console.log('checking win');
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

//socket.on('endPage', (board) )

const renderStats = (maxPlayedPerson, maxPlayed, maxWinPerson, maxWin, maxLossPerson, maxLoss) => {
    const statDiv = document.getElementById("playStats");
    statDiv.innerHTML = '';

    let playDiv = document.createElement('div');
    let playPerson = document.createElement('div')
    let playVal = document.createElement('div');
    playPerson.appendChild(document.createTextNode("Person with the Most Games Played: " + maxPlayedPerson));
    playVal.appendChild(document.createTextNode("With a total of " + maxPlayed + " Games Played"));
    playDiv.appendChild(playPerson);
    playDiv.appendChild(playVal);

    let winDiv = document.createElement('div');
    let winPerson = document.createElement('div')
    let winVal = document.createElement('div');
    winPerson.appendChild(document.createTextNode("Person with the Most Wins: " + maxWinPerson));
    winVal.appendChild(document.createTextNode("With a total of " + maxWin + " Games won"));
    winDiv.style.backgroundColor = 'green';
    winDiv.appendChild(winPerson);
    winDiv.appendChild(winVal);

    let spacingP1 = document.createElement('p');
    let spacingP2 = document.createElement('p');
    let spacingP3 = document.createElement('p');

    let lossDiv = document.createElement('div');
    let lossPerson = document.createElement('div')
    let lossVal = document.createElement('div');
    lossPerson.appendChild(document.createTextNode("Person with the Most Losses: " + maxLossPerson));
    lossVal.appendChild(document.createTextNode("With a total of " + maxLoss + " Games Lost"));
    lossDiv.style.backgroundColor = 'red';
    lossDiv.appendChild(lossPerson);
    lossDiv.appendChild(lossVal);


    statDiv.appendChild(spacingP1);
    statDiv.appendChild(playDiv);

    statDiv.appendChild(spacingP2);
    statDiv.appendChild(winDiv);

    statDiv.appendChild(spacingP3);
    statDiv.appendChild(lossDiv);
}


socket.emit('renderStats', (stats) => {
    renderStats(stats.maxPlayedPerson, stats.maxPlayed, stats.maxWinPerson, stats.maxWin, stats.maxLossPerson, stats.maxLoss)
});

socket.emit('renderList', (boardList) => {
    renderList(boardList);
});

const renderList = (boardList) => {
    if (boardList !=null) {
        let listval = document.getElementById('activeGames');
    for (let i = 0; i < boardList.length; i++) {
        let li = document.createElement("li");
        li.textContent = boardList[i];
        listval.appendChild(li);
    }
}
}

function createEvents() {
    but0[0].addEventListener('click', function() 
    {
        if (turn == currentBoard.currentTurn && currentBoard.playertwo != null) {
            socket.emit ('drop', 0, currentBoardID, turn, (response) => {
                if (checkWin(response.y, response.x))
                {
                    if (turn == 0) {
                        currentBoard.playerone = 3;
                        currentBoard.playertwo = -1;
                    }
                    else {
                        currentBoard.playertwo = 3
                        currentBoard.playerone = -1;
                    }
                    console.log('win');
                    socket.emit('boardSet', currentBoardID, currentBoard, (response) => {
                        console.log(response);
                    });

                }
                /*else if (checkTie) {
                    currentBoard.playerone = 5;
                    socket.emit('boardSet', currentBoardID, (response) => {
                        console.log(response);
                    });
                }*/
            });
        }
        //drop(0);
    });
    
    but1[0].addEventListener('click', function() 
    {
        if (turn == currentBoard.currentTurn && currentBoard.playertwo != null) {
            socket.emit ('drop', 1, currentBoardID, turn, (response) => {
                if (checkWin(response.y, response.x))
                {
                    if (turn == 0) {
                        currentBoard.playerone = 3;
                        currentBoard.playertwo = -1;
                    }
                    else {
                        currentBoard.playertwo = 3
                        currentBoard.playerone = -1;
                    }
                    //console.log('win');
                    socket.emit('boardSet', currentBoardID, currentBoard, (response) => {
                        console.log(response);
                    });
                }
            });
        }
        //drop(1);
    });
    
    but2[0].addEventListener('click', function() 
    {
        if (turn == currentBoard.currentTurn && currentBoard.playertwo != null) {
            socket.emit ('drop', 2, currentBoardID, turn, (response) => {
                if (checkWin(response.y, response.x))
                {
                    if (turn == 0) {
                        currentBoard.playerone = 3;
                        currentBoard.playertwo = -1;
                    }
                    else {
                        currentBoard.playertwo = 3
                        currentBoard.playerone = -1;
                    }
                    //console.log('win');
                    socket.emit('boardSet', currentBoardID, currentBoard,  (response) => {
                        console.log(response);
                    });
                }
            });
        }
        //drop(2);
    });
    
    
    but3[0].addEventListener('click', function() 
    {
        if (turn == currentBoard.currentTurn && currentBoard.playertwo != null) {
            socket.emit ('drop', 3, currentBoardID, turn, (response) => {
                if (checkWin(response.y, response.x))
                {
                    if (turn == 0) {
                        currentBoard.playerone = 3;
                        currentBoard.playertwo = -1;
                    }
                    else {
                        currentBoard.playertwo = 3
                        currentBoard.playerone = -1;
                    }
                    //console.log('win');
                    socket.emit('boardSet', currentBoardID, currentBoard,  (response) => {
                        console.log(response);
                    });
                }
            });
        }
        //drop(3);
    });
    
    
    but4[0].addEventListener('click', function() 
    {
        if (turn == currentBoard.currentTurn && currentBoard.playertwo != null) {
            socket.emit ('drop', 4, currentBoardID, turn, (response) => {
                if (checkWin(response.y, response.x))
                {
                    if (turn == 0) {
                        currentBoard.playerone = 3;
                        currentBoard.playertwo = -1;
                    }
                    else {
                        currentBoard.playertwo = 3
                        currentBoard.playerone = -1;
                    }
                    //console.log('win');
                    socket.emit('boardSet', currentBoardID, currentBoard,  (response) => {
                        console.log(response);
                    });
                }
            });
        }
        //drop(4);
    });
    
    but5[0].addEventListener('click', function() 
    {
        if (turn == currentBoard.currentTurn && currentBoard.playertwo != null) {
            socket.emit ('drop', 5, currentBoardID, turn, (response) => {
                if (checkWin(response.y, response.x))
                {
                    if (turn == 0) {
                        currentBoard.playerone = 3;
                        currentBoard.playertwo = -1;
                    }
                    else {
                        currentBoard.playertwo = 3
                        currentBoard.playerone = -1;
                    }
                    //console.log('win');
                    socket.emit('boardSet', currentBoardID, currentBoard,  (response) => {
                        console.log(response);
                    });
                }
            });
        }
        //drop(5);
    });
    
    
    but6[0].addEventListener('click', function() 
    {
        if (turn == currentBoard.currentTurn && currentBoard.playertwo != null) {
            socket.emit ('drop', 6, currentBoardID, turn, (response) => {
                console.log(response.x)
                if (checkWin(response.y, response.x))
                {
                    if (turn == 0) {
                        currentBoard.playerone = 3;
                        currentBoard.playertwo = -1;
                    }
                    else {
                        currentBoard.playertwo = 3
                        currentBoard.playerone = -1;
                    }
                    //console.log('win');
                    socket.emit('boardSet', currentBoardID, currentBoard,  (response) => {
                        console.log(response);
                    });
                }
            });
        }
        //drop(6);
    });
    
    }

const renderBoard = () => {
    const boardDiv = document.getElementById('board');
    boardDiv.innerHTML = ''; // clear the board
    const pageDiv = document.getElementById('stuff');
    pageDiv.innerHTML = '';

    // TODO: Render the board to the DOM, each row should be a div,
    //       and each cell should be a div inside that row div.
    //       Each cell should have a class of 'cell' and the text
    //       content should be the character at that position in the board.
    

     for (let i = 0; i < (currentBoard.boardSet).length; i++) {
          const rowDiv = document.createElement('div');
          rowDiv.className = "row";
          for (let j = 0; j < (currentBoard.boardSet)[i].length; j++) {
              const cellDiv = document.createElement('div');
              cellDiv.className = 'cell';
              //let currDiv = cellDiv[j];
              
              const cellSpan = document.createElement('span');
              cellSpan.className='span' + i + j;
              cellSpan.appendChild(document.createTextNode((currentBoard.boardSet)[i][j]));
            
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

          let turntxt = document.createElement('div');

            if (turn == 0) {
                turntxt.style.color = 'red'
        }
        else {
            turntxt.style.color = 'blue';
        }
        turntxt.style.fontWeight = 'bold'
            turntxt.appendChild(document.createTextNode(("Player: ") + (turn+1)));
            boardDiv.appendChild(turntxt);


       // let boardDiv = document.getElementById('board');
    let trntxt = document.getElementById('trntxt');
    if (trntxt == null) {
        trntxt = document.createElement('div');
        trntxt.setAttribute('id', 'trntxt');
    }
    else {
        trntxt.innerHTML = '';
    }
    let para = document.createElement('p');
    if (currentBoard.currentTurn == 0) {
        para.style.color = 'red';
    }
    else {
        para.style.color = 'blue';
    }
    para.textContent = "Player: " + (currentBoard.currentTurn + 1) + "'s Turn";
    //trntxt.appendChild(document.createTextNode ("\n\nPlayer: " + (currentBoard.currentTurn + 1) + "'s Turn"));
    trntxt.appendChild(para);
    boardDiv.appendChild(trntxt);

        but0 = document.getElementsByClassName('button0');
        but1 = document.getElementsByClassName('button1');
        but2 = document.getElementsByClassName('button2');
        but3 = document.getElementsByClassName('button3');
        but4 = document.getElementsByClassName('button4');
        but5 = document.getElementsByClassName('button5');
        but6 = document.getElementsByClassName('button6');

        boardID.innerHTML = "Board ID: " + currentBoardID;
        createEvents();
};



document.getElementById('start').addEventListener('click', function() {
    socket.emit('create', (response) => {
        console.log('Creating Game');
        currentBoard.boardID = response.boardID;
        currentBoard.boardSet = response.boardSet;
        currentBoard.playerone = response.playerone;
        currentBoard.playertwo = response.playertwo;
        currentBoard.currentTurn = response.currentTurn;
        currentBoardID = currentBoard.boardID;

        socket.emit('start', currentBoardID, (response) => {
            currentBoard.boardID = (response.val1).boardID;
            currentBoard.boardSet = (response.val1).boardSet;
            currentBoard.playerone = (response.val1).playerone;
            currentBoard.playertwo = (response.val1).playertwo;
            currentBoard.currentTurn = (response.val1).currentTurn;

            turn = response.val2;
            renderBoard();
            
            
            renderList();

            
        });

    });

});

document.getElementById('joinGame').addEventListener('click', function() {
    let m = document.getElementById('gameTag');
    //join game
    let newID = m.value;
    socket.emit('join', newID, (response) => {
        if (response != null) {
            console.log('Joining Game ' + (response.val1).boardID);
            currentBoard = response.val1;
            currentBoard.boardID = (response.val1).boardID;
            currentBoard.boardSet = (response.val1).boardSet;
            currentBoard.playerone = (response.val1).playerone;
            currentBoard.playertwo = (response.val1).playertwo;
            currentBoard.currentTurn = (response.val1).currentTurn;
            currentBoardID = currentBoard.boardID
            turn = response.val2;

            renderBoard();
            renderList();


            
            
        }
        else {
            console.log("Invalid tag");
        }
    });



});


