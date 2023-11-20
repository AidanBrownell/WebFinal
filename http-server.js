const express = require('express');
const cors = require('cors');
const fs = require('fs');
let statList = [];


const app = express();
const HTTP_PORT = 4003;

// Allow any origin
app.use(cors());

// Serve static files from the current directory
app.use(express.static(__dirname));

app.listen(HTTP_PORT, () => {
    console.log(`HTTP Server started on port ${HTTP_PORT}`);
});


/* Socket.io server */

const io = require('socket.io')(4004, {
    cors: {
      origin: '*',
    }
});

  
const boards = {};
const boardList = [];



    
const renderStats = () => {
    let maxWin = 0;
    let maxLoss = 0;
    let maxPlayed = 0;
    let maxPlayedPerson = '';
    let maxWinPerson = '';
    let maxLossPerson = '';
    const stats = JSON.parse(fs.readFileSync('./users.json'));
    for (let i = 0; i < stats.length; i++)
    {
        if (stats[i]["GamesPlayed"] > maxPlayed) {
            maxPlayed = stats[i]["GamesPlayed"];
            maxPlayedPerson=stats[i]["Name"];
        }

        if (stats[i]["GamesWon"] > maxWin) {
            maxWin = stats[i]["GamesWon"];
            maxWinPerson=stats[i]["Name"];
        }

        if (stats[i]["GamesLost"] > maxLoss) {
            maxLoss = stats[i]["GamesLost"];
            maxLossPerson=stats[i]["Name"];
        }

    }
    let statObj = {
        "maxPlayedPerson": maxPlayedPerson, 
        "maxPlayed": maxPlayed,

        "maxWinPerson": maxWinPerson,
        "maxWin": maxWin,

        "maxLossPerson": maxLossPerson,
        "maxLoss": maxLoss
    }
    return (statObj);
}



io.on('connection', (socket) => {

    console.log('New connection:', socket.id);

    socket.on('renderList', (callback) => {
        callback(boardList);
    });

    socket.on('renderStats', (callback) => {
        let stats = renderStats();
        callback(stats);
    });

    socket.on('updateStats', (val, callback) => {
        console.log('updating stats');
        let user = val.val1;
        let wl = val.val2;
        const stats = JSON.parse(fs.readFileSync('./users.json'));
        console.log("STATS = " + stats);
        statList.splice(0, statList.length);
        if (stats.length == 0) {
            if (wl == "win") {
                console.log("PUSHIGN HERE 1: " + stats[i]["Name"]);
                let newUser = {"Name": user, "GamesPlayed": 1, "GamesWon": 1, "GamesLost": 0, "GamesTied": 0} 
                statList.push(newUser);
            }
            else
            {
                console.log("PUSHIGN HERE 2: " + stats[i]["Name"]);
                let newUser = {"Name": user, "GamesPlayed": 1, "GamesWon": 0, "GamesLost": 1, "GamesTied": 0} 
                statList.push(newUser);
            }
            fs.writeFileSync("./users.json", JSON.stringify(statList));
            callback(true);
        }
        else {
            console.log(statList);
            for (let i = 0; i < stats.length; i++) {
                console.log('AT i: ' + stats[i]["Name"]);
                if (stats[i]["Name"] == user) {
                    if (wl == "win") {
                        console.log("PUSHIGN HERE 3: " + stats[i]["Name"]);
                        stats[i]["GamesPlayed"]++;
                        stats[i]["GamesWon"]++;
                        statList.push(stats[i]);
                    }
                    else
                    {
                        console.log("PUSHIGN HERE 4: " + stats[i]["Name"]);
                        stats[i]["GamesPlayed"]++;
                        stats[i]["GamesLost"]++;
                        statList.push(stats[i]);
                    }
                }
                else if (i+1 >= stats.length) {
                    if (wl == "win") {
                        let newUser = {"Name": user, "GamesPlayed": 1, "GamesWon": 1, "GamesLost": 0, "GamesTied": 0} 
                        console.log("PUSHIGN HERE 5: " + stats[i]["Name"]);
                        statList.push(newUser);
                        statList.push(stats[i]);
                    }
                    else
                    {
                        let newUser = {"Name": user, "GamesPlayed": 1, "GamesWon": 0, "GamesLost": 1, "GamesTied": 0} 
                        console.log("PUSHIGN HERE 6: " + stats[i]["Name"]);
                        statList.push(newUser);
                        statList.push(stats[i]);
                    }
                    fs.writeFileSync("./users.json", JSON.stringify(statList));

                }
                else if (i < stats.length-1) {
                    console.log("PUSHIGN HERE 7: " + stats[i]["Name"]);
                    statList.push(stats[i]);
                }
            }
            console.log("StatLIST = " + statList["Name"]);
            fs.writeFileSync("./users.json", JSON.stringify(statList));
            callback(true);
        }
    });

    socket.on('create', (callback) => {
        console.log("Creating board");
        const boardID = Math.random().toString(36).substr(2, 5);
        const board = {boardID: boardID, boardSet: Array(7).fill().map(() => Array(7).fill(' ')), playerone: null, playertwo: null, currentTurn: null};
        boards[boardID] = board;
        boardList.push(boardID);
        socket.join(boardID);
        console.log(boardID);
        callback(board);
    });

    socket.on('start', (boardID, callback) => {
        console.log('Starting game');
        let turn = 0;
        let board = boards[boardID];
        if (board == null) {
            return null;
        }
        if (board.playerone == null && board.playertwo == null) {
            let randDec = Math.random(2);
            let rand = Math.round(randDec);
            if (rand == 0)
            {
                board.playerone = 0;
                turn = 0;
            }
            else {
                board.playertwo = 1;
                turn = 1;
            }
        }
        else if (board.playerone == 0) {
            board.playertwo = 1;
            turn = 1;
        }
        else if (board.playertwo == 1) {
            board.playerone = 0;
            turn = 0;
        }
        board.currentTurn = 0;


        let val = {val1: board, val2: turn}
        callback (val);

    });



    socket.on('join', (boardID, callback) => {
        if (boards[boardID] != null) {
            if (boards[boardID].playerone != null && boards[boardID].playertwo != null) {
                console.log('Invalid Tag');
                callback(null);
            }
            else {
            socket.join(boardID);
            let board = boards[boardID];
            if (board.playerone == null) {
                board.playerone = 0;
                turn = 0
            }
            else {
                board.playertwo = 1; 
                turn = 1;
            }

            console.log("Joined: " + boardID);

            let val = {val1: board, val2: turn}
            
            for (let i = 0; i < boardList.length; i++) {
                if (boardList[i] == boardID) {
                    boardList.splice(i, 1);
                }
            }
            io.to(boardID).emit('update', (board));
            callback(val);
            }
        }
        else{
        console.log('Invalid Tag');
        callback(null);
        }
    });

    socket.on('boardSet', (boardID, currboard, callback) => {
        let board = boards[boardID];
        board.boardID = currboard.boardID;
        board.boardSet = currboard.boardSet;
        board.playerone = currboard.playerone;
        board.playertwo = currboard.playertwo;
        board.currentTurn = currboard.currentTurn;
        boards[boardID] = board;
        io.to(boardID).emit('updateB', board);
        console.log("HERE1")
        callback(board);
    });





    socket.on('drop', (col, boardID, turn, callback) => {
        if (boards[boardID] != null) {
            let board = boards[boardID];
            if (board.playerone != null && board.playertwo != null) {
                if (board.currentTurn == turn) {
                    for (let i = 6; i >= 0; i--) {

                        if (board.boardSet[i][col] == ' ') {
                            board.boardSet[i][col] = 'O';
                            io.to(boardID).emit('color', board, i, col);

                            let x = col;
                            let y = i;
                            if (board.currentTurn == 0) {
                                board.currentTurn = 1;
                            }
                            else {
                                board.currentTurn = 0;
                            }

                            boards[boardID] = board;
                                
                            let val = {b: board, x: x, y: y}
                            callback(val);
                            break;
                        }
                       

                    }
                    let val = {b: board, x: null, y: null}
                    io.to(boardID).emit('updatePlayer', (board));
                    callback(val)
                }
                else {
                    let val = {b: board, x: null, y: null}
                    io.to(boardID).emit('updatePlayer', (board));
                    callback(val)
                }
            }
            else {
                let val = {b: board, x: null, y: null}
                io.to(boardID).emit('updatePlayer', (board));
                callback(val)
            }

        }
        else {
            let val = {b: null, val2: false}
            io.to(boardID).emit('updatePlayer', (board));
            callback(val);
        }
    })

});

console.log(`Server started on port 4004`);
