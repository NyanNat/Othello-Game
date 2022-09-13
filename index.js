let start = document.getElementById('startButton');
let restart = document.getElementById('restartButton');
let border = document.getElementById('cellContainer');
let roundText = document.getElementById('announcerText');
let startButton = document.getElementById('startBtn');          //player click start button first, then the game can start
let GAME = [];                                                  //array for the game itself, storing the elements for each cell
let GAME_TOP = [0,1,2,3,4,5,6,7];                               //array that contain the cell numbers of the most-top cells 
let GAME_BOTTOM = [56,57,58,59,60,61,62,63];                    //array that contain the cell numbers of the most-bottom cells
let GAME_LEFT = [0,8,16,24,32,40,48,56];                        //array that contain the cell numbers of the most-left cells
let GAME_RIGHT = [7,15,23,31,39,47,55,63];                      //array that contain the cell numbers of the most-right cells
let gameTurn;
let totalPiece;
let white;
let black;
let winner;

//Make the game board
border.style.display = 'grid';
border.style.gridTemplateColumns = 'repeat(8,60px)';
border.style.gridTemplateRows = 'repeat(8,60px)';
border.style.width ='fit-content';
border.style.gap = '17px';


//Activate the start button
startButton.addEventListener('click',function(){
    gameTurn = 'black';         //The game alwasy start with the black's turn
    white = 2;                  //Put in the initial number of pieces on the board for each color
    black = 2;

    //Start the announcer
    announcementChange(0);                              //Change the announcement text 
    startButton.disabled = true;                        //to not allow user to click the start button again after playing

    cellCheck();
});

for(let i = 0; i<64; i++){   
    let pieceObj = {                                              
        cellNumber : i,                                     
        color : 'blank',                                //Set the first color of pieces to blank to mark empty cells
        alreadyClicked : false,                         //initialize the array for checking whether the cell has been clicked before as false <= has not been clicked
        disabled : true,                                //To check whether the cell is disabled or not
        immediateBottom : [],                           //Array for storing the possible pieces to change when placing a piece of certain color on a certain cell
        immediateUp : [],
        immediateLeft : [],
        immediateRight : [],
        immediateDiaLeftBot : [],
        immediateDiaLeftTop : [],
        immediateDiaRightBot : [],
        immediateDiaRightTop : []
    }

    GAME.push(pieceObj);
}

//Make the board cell
for(let i = 0; i<64; i++){
    const cell = document.createElement('div');
    cell.style.backgroundColor ='green';
    cell.style.border = 'solid';
    cell.style.height ='60px';
    cell.style.width ='60px';
    cell.style.borderRadius = '5px';
    cell.style.padding = '5px';
    cell.setAttribute('id', i);

    border.appendChild(cell);

    //Create the game
    if(i == 27 || i == 36){                                     //cell number 27 and 36 will be appended with black piece
        //Create the black piece
        const piece= document.createElement('div');
        piece.style.width = '50px';
        piece.style.height = '50px';
        piece.style.borderRadius = '50%';
        piece.style.border = 'solid';
        piece.style.backgroundColor = 'black';
        piece.setAttribute('id', 'piece-'+i);

        cell.appendChild(piece);
        GAME[i].color = 'black';
        GAME[i].alreadyClicked = true;
    }
    else if(i == 28 || i == 35){                                //cell number 28 and 35 will be appended with white piece
        //Create the white piece
        const piece= document.createElement('div');
        piece.style.width = '50px';
        piece.style.height = '50px';
        piece.style.borderRadius = '50%';
        piece.style.border = 'solid';
        piece.style.backgroundColor = 'white';
        piece.setAttribute('id', 'piece-'+i);
        
        cell.appendChild(piece);
        GAME[i].color = 'white';
        GAME[i].alreadyClicked = true;
    }
    else{
        cell.addEventListener('click', function(){
            if(GAME[i].alreadyClicked == false && GAME[i].disabled == false){       //If the cell has not been clicked before, then we can append the piece
                //Create the piece
                const piece= document.createElement('div');             //put the piece in the cell
                piece.style.width = '50px';
                piece.style.height = '50px';
                piece.style.borderRadius = '50%';
                piece.style.border = 'solid';
                piece.style.backgroundColor = gameTurn;
                piece.setAttribute('id', 'piece-'+i);
            
                cell.appendChild(piece);                                
                GAME[i].alreadyClicked = true;                         //To make sure that the cell cannot be clicked again

                //Change color of the piece every click
                if(gameTurn == 'black'){
                    GAME[i].color = 'black';                            //change the object color to reflect the cell itself
                    gameTurn = 'white';
                    black = black + (GAME[i].immediateBottom.length + GAME[i].immediateLeft.length + GAME[i].immediateRight.length + GAME[i].immediateUp.length + GAME[i].immediateDiaLeftBot.length + GAME[i].immediateDiaLeftTop.length + GAME[i].immediateDiaRightBot.length + GAME[i].immediateDiaRightTop.length) + 1;
                    white = white - (GAME[i].immediateBottom.length + GAME[i].immediateLeft.length + GAME[i].immediateRight.length + GAME[i].immediateUp.length + GAME[i].immediateDiaLeftBot.length + GAME[i].immediateDiaLeftTop.length + GAME[i].immediateDiaRightBot.length + GAME[i].immediateDiaRightTop.length);
                }
                else if(gameTurn == 'white'){
                    GAME[i].color = 'white';
                    gameTurn = 'black';
                    black = black - (GAME[i].immediateBottom.length + GAME[i].immediateLeft.length + GAME[i].immediateRight.length + GAME[i].immediateUp.length + GAME[i].immediateDiaLeftBot.length + GAME[i].immediateDiaLeftTop.length + GAME[i].immediateDiaRightBot.length + GAME[i].immediateDiaRightTop.length);
                    white = white + (GAME[i].immediateBottom.length + GAME[i].immediateLeft.length + GAME[i].immediateRight.length + GAME[i].immediateUp.length + GAME[i].immediateDiaLeftBot.length + GAME[i].immediateDiaLeftTop.length + GAME[i].immediateDiaRightBot.length + GAME[i].immediateDiaRightTop.length) + 1;
                }

                //After putting the piece and changing the next designated player color, we announce it on the announcementText
                announcementChange(0);

                if(GAME[i].immediateBottom.length > 0){
                    for(let j= 0; j< GAME[i].immediateBottom.length; j++){
                        if(GAME[GAME[i].immediateBottom[j]].color == 'black'){
                            GAME[GAME[i].immediateBottom[j]].color = 'white';
                        }
                        else if(GAME[GAME[i].immediateBottom[j]].color == 'white'){
                            GAME[GAME[i].immediateBottom[j]].color = 'black';
                        }
                        let pieceToChange = document.getElementById('piece-'+ GAME[i].immediateBottom[j]);
                        pieceToChange.style.backgroundColor = GAME[GAME[i].immediateBottom[j]].color;
                    }
                }

                if(GAME[i].immediateUp.length > 0){
                    for(let j= 0; j< GAME[i].immediateUp.length; j++){
                        if(GAME[GAME[i].immediateUp[j]].color == 'black'){
                            GAME[GAME[i].immediateUp[j]].color = 'white';
                        }
                        else if(GAME[GAME[i].immediateUp[j]].color == 'white'){
                            GAME[GAME[i].immediateUp[j]].color = 'black';
                        }
                        let pieceToChange = document.getElementById('piece-'+ GAME[i].immediateUp[j]);
                        pieceToChange.style.backgroundColor = GAME[GAME[i].immediateUp[j]].color;
                    }
                }

                if(GAME[i].immediateRight.length > 0){
                    for(let j= 0; j< GAME[i].immediateRight.length; j++){
                        if(GAME[GAME[i].immediateRight[j]].color == 'black'){
                            GAME[GAME[i].immediateRight[j]].color = 'white';
                        }
                        else if(GAME[GAME[i].immediateRight[j]].color == 'white'){
                            GAME[GAME[i].immediateRight[j]].color = 'black';
                        }
                        let pieceToChange = document.getElementById('piece-'+ GAME[i].immediateRight[j]);
                        pieceToChange.style.backgroundColor = GAME[GAME[i].immediateRight[j]].color;
                    }
                }

                if(GAME[i].immediateLeft.length > 0){
                    for(let j= 0; j< GAME[i].immediateLeft.length; j++){
                        if(GAME[GAME[i].immediateLeft[j]].color == 'black'){
                            GAME[GAME[i].immediateLeft[j]].color = 'white';
                        }
                        else if(GAME[GAME[i].immediateLeft[j]].color == 'white'){
                            GAME[GAME[i].immediateLeft[j]].color = 'black';
                        }
                        let pieceToChange = document.getElementById('piece-'+ GAME[i].immediateLeft[j]);
                        pieceToChange.style.backgroundColor = GAME[GAME[i].immediateLeft[j]].color;
                    }
                }


                if(GAME[i].immediateDiaRightBot.length > 0){
                    for(let j= 0; j< GAME[i].immediateDiaRightBot.length; j++){
                        if(GAME[GAME[i].immediateDiaRightBot[j]].color == 'black'){
                            GAME[GAME[i].immediateDiaRightBot[j]].color = 'white';
                        }
                        else if(GAME[GAME[i].immediateDiaRightBot[j]].color == 'white'){
                            GAME[GAME[i].immediateDiaRightBot[j]].color = 'black';
                        }
                        let pieceToChange = document.getElementById('piece-'+ GAME[i].immediateDiaRightBot[j]);
                        pieceToChange.style.backgroundColor = GAME[GAME[i].immediateDiaRightBot[j]].color;
                    }
                }

                if(GAME[i].immediateDiaLeftBot.length > 0){
                    for(let j= 0; j< GAME[i].immediateDiaLeftBot.length; j++){
                        if(GAME[GAME[i].immediateDiaLeftBot[j]].color == 'black'){
                            GAME[GAME[i].immediateDiaLeftBot[j]].color = 'white';
                        }
                        else if(GAME[GAME[i].immediateDiaLeftBot[j]].color == 'white'){
                            GAME[GAME[i].immediateDiaLeftBot[j]].color = 'black';
                        }
                        let pieceToChange = document.getElementById('piece-'+ GAME[i].immediateDiaLeftBot[j]);
                        pieceToChange.style.backgroundColor = GAME[GAME[i].immediateDiaLeftBot[j]].color;
                    }
                }

                if(GAME[i].immediateDiaRightTop.length > 0){
                    for(let j= 0; j< GAME[i].immediateDiaRightTop.length; j++){
                        if(GAME[GAME[i].immediateDiaRightTop[j]].color == 'black'){
                            GAME[GAME[i].immediateDiaRightTop[j]].color = 'white';
                        }
                        else if(GAME[GAME[i].immediateDiaRightTop[j]].color == 'white'){
                            GAME[GAME[i].immediateDiaRightTop[j]].color = 'black';
                        }
                        let pieceToChange = document.getElementById('piece-'+ GAME[i].immediateDiaRightTop[j]);
                        pieceToChange.style.backgroundColor = GAME[GAME[i].immediateDiaRightTop[j]].color;
                    }
                }

                if(GAME[i].immediateDiaLeftTop.length > 0){
                    for(let j= 0; j< GAME[i].immediateDiaLeftTop.length; j++){
                        if(GAME[GAME[i].immediateDiaLeftTop[j]].color == 'black'){
                            GAME[GAME[i].immediateDiaLeftTop[j]].color = 'white';
                        }
                        else if(GAME[GAME[i].immediateDiaLeftTop[j]].color == 'white'){
                            GAME[GAME[i].immediateDiaLeftTop[j]].color = 'black';
                        }
                        let pieceToChange = document.getElementById('piece-'+ GAME[i].immediateDiaLeftTop[j]);
                        pieceToChange.style.backgroundColor = GAME[GAME[i].immediateDiaLeftTop[j]].color;
                    }
                }

                totalPiece = black + white;
                cellCheck();
            }
        });
    }

}

function announcementChange(state){                             //Make function for changing the announcement on the bottom of the board
    if(state == 0){         //If the game is still running
        roundText.textContent = `TURN : ${gameTurn}`;
    }
    else if(state == 1){    //If the game has finished
        roundText.textContent = `GAME IS FINISHED, THE WINNER IS ${winner}`;
    }
}

function cellCheck(){                                           //Make a function to check the cell
    GAME.forEach((elements) => {
        elements.disabled = true;
        elements.immediateBottom = [];
        elements.immediateUp = [];
        elements.immediateRight = [];
        elements.immediateLeft = [];
        elements.immediateDiaRightBot = [];
        elements.immediateDiaLeftBot = [];
        elements.immediateDiaLeftTop = [];
        elements.immediateDiaRightTop = [];
    });


    for(let i = 0; i <64; i++){
        if(GAME[i].alreadyClicked == true){
            continue;
        }
        else if(GAME[i].alreadyClicked == false){
            GAME[i].immediateBottom = immediateCheck(i, 8);         //Check the function, and calculate all of the posible piece to change color for each day
            GAME[i].immediateUp = immediateCheck(i, -8);
            GAME[i].immediateRight = immediateCheck(i, 1);
            GAME[i].immediateLeft = immediateCheck(i, -1);
            GAME[i].immediateDiaRightBot = immediateCheck(i, 9);
            GAME[i].immediateDiaLeftBot = immediateCheck(i, 7);
            GAME[i].immediateDiaRightTop = immediateCheck(i, -7);
            GAME[i].immediateDiaLeftTop = immediateCheck(i, -9);
        }
    }

    totalClicked = 0;                                                       
    for(let i = 0; i<64; i++){
        let changeColor = document.getElementById(i);
        if(GAME[i].disabled == false){                              //If there is posibility for some piece changing for a cell, background color act as highlight of possible clikable cell
            changeColor.style.backgroundColor = 'yellow'
        }
        else{
            changeColor.style.backgroundColor = 'green';
        }
    }

    if(totalPiece == 64){
        if(white > black){
            winner = 'WHITE';
        }
        else if(black > white){
            winner = 'BLACK';
        }
        else{
            winner = 'DRAW';
        }
        announcementChange(1);                                          //Change the cnnouncement text to ending
        
    }
}

function immediateCheck(location, jumpNum){                             //Check the possible pieces to be changed, different number for different cell directions.
    let returnArray = [];
    let locationTemp = location + jumpNum;

    if(jumpNum == 8){
        while(locationTemp <= 63){
            if(GAME[locationTemp].color == gameTurn && returnArray.length == 0){
                return returnArray;
            }
            else if(GAME[locationTemp].color == gameTurn && returnArray.length >= 0){
                GAME[location].disabled = false;
                return returnArray;
            }
            else if(GAME[locationTemp].color == 'blank' && returnArray.length >= 0){
                returnArray = [];
                return returnArray;
            }
            else if(GAME[locationTemp].color != gameTurn && GAME[location+jumpNum].color != 'blank'){
                returnArray.push(locationTemp);
            }
            else{
                returnArray = [];
                return returnArray;
            }
            locationTemp = locationTemp + jumpNum;
        }

        returnArray = [];
        return returnArray;
    }
    else if(jumpNum == -8){
        while(locationTemp >= 0){
            if(GAME[locationTemp].color == gameTurn && returnArray.length == 0){
                return returnArray;
            }
            else if(GAME[locationTemp].color == gameTurn && returnArray.length >= 0){
                GAME[location].disabled = false;
                return returnArray;
            }
            else if(GAME[locationTemp].color == 'blank' && returnArray.length >= 0){
                returnArray = [];
                return returnArray;
            }
            else if(GAME[locationTemp].color != gameTurn && GAME[location+jumpNum].color != 'blank'){
                returnArray.push(locationTemp);
            }
            else{
                returnArray = [];
                return returnArray;
            }
            locationTemp = locationTemp + jumpNum;
        }
        returnArray = [];
        return returnArray;
    }
    
    else if(jumpNum == 1){
        for(let i = 0; i< GAME_RIGHT.length; i++){
            if(location == GAME_RIGHT[i]){
                returnArray = [];
                return returnArray;
            }
        }

        while(locationTemp <= 63){
            let approved = 0;

            for(let i = 0; i< GAME_RIGHT.length; i++){
                if(locationTemp != GAME_RIGHT[i]){
                    approved =  approved + 1;
                    }
                }

            if(GAME[locationTemp].color == gameTurn && returnArray.length == 0){
                return returnArray;
            }
            else if(GAME[locationTemp].color == gameTurn && returnArray.length >= 0){
                GAME[location].disabled = false;
                return returnArray;
            }
            else if(GAME[locationTemp].color == 'blank' && returnArray.length >= 0){
                returnArray = [];
                return returnArray;
            }
            else if(GAME[locationTemp].color != gameTurn && GAME[locationTemp].color != 'blank'){
                returnArray.push(locationTemp);
                if(approved != GAME_RIGHT.length){
                    returnArray = [];
                    return returnArray;
                }
            }
            else{
                returnArray = [];
                return returnArray;
            }
            locationTemp = locationTemp + jumpNum;
        }
    }

    else if(jumpNum == -1){
        for(let i = 0; i< GAME_LEFT.length; i++){
            if(location == GAME_LEFT[i]){
                returnArray = [];
                return returnArray;
            }
        }

        while(locationTemp >= 0){
            let approved = 0;

            for(let i = 0; i< GAME_LEFT.length; i++){
                if(locationTemp != GAME_LEFT[i]){
                    approved =  approved + 1;
                    }
                }

            if(GAME[locationTemp].color == gameTurn && returnArray.length == 0){
                return returnArray;
            }
            else if(GAME[locationTemp].color == gameTurn && returnArray.length >= 0){
                GAME[location].disabled = false;
                return returnArray;
            }
            else if(GAME[locationTemp].color == 'blank' && returnArray.length >= 0){
                returnArray = [];
                return returnArray;
            }
            else if(GAME[locationTemp].color != gameTurn && GAME[locationTemp].color != 'blank'){
                returnArray.push(locationTemp);
                if(approved != GAME_LEFT.length){
                    returnArray = [];
                    return returnArray;
                }
            }
            else{
                returnArray = [];
                return returnArray;
            }
            locationTemp = locationTemp + jumpNum;
        }
    }

    else if(jumpNum == 9){
        for(let i = 0; i< GAME_RIGHT.length; i++){
            if(location == GAME_RIGHT[i]){
                returnArray = [];
                return returnArray;
            }
        }
        for(let i = 0; i< GAME_BOTTOM.length; i++){
            if(location == GAME_BOTTOM[i]){
                returnArray = [];
                return returnArray;
            }
        }

        while(locationTemp <= 63){
            let approved = 0;

            for(let i = 0; i< GAME_RIGHT.length; i++){
                if(locationTemp != GAME_RIGHT[i]){
                    approved =  approved + 1;
                    }
                }
            for(let i = 0; i< GAME_BOTTOM.length; i++){
                if(locationTemp != GAME_BOTTOM[i]){
                    approved =  approved + 1;
                    }
                }
            
            if(GAME[locationTemp].color == gameTurn && returnArray.length == 0){
                return returnArray;
            }
            else if(GAME[locationTemp].color == gameTurn && returnArray.length >= 0){
                console.log(returnArray + ", "+ location);
                GAME[location].disabled = false;
                return returnArray;
            }
            else if(GAME[locationTemp].color == 'blank' && returnArray.length >= 0){
                returnArray = [];
                return returnArray;
            }
            else if(GAME[locationTemp].color != gameTurn && GAME[locationTemp].color != 'blank'){
                returnArray.push(locationTemp);
                if(approved != 16){
                    returnArray = [];
                    return returnArray;
                }
            }
            else{
                returnArray = [];
                return returnArray;
            }
            locationTemp = locationTemp + jumpNum;
        }
    }

    else if(jumpNum == 7){
        for(let i = 0; i< GAME_LEFT.length; i++){
            if(location == GAME_LEFT[i]){
                returnArray = [];
                return returnArray;
            }
        }
        for(let i = 0; i< GAME_BOTTOM.length; i++){
            if(location == GAME_BOTTOM[i]){
                returnArray = [];
                return returnArray;
            }
        }

        while(locationTemp > 0){
            let approved = 0;

            for(let i = 0; i< GAME_LEFT.length; i++){
                if(locationTemp != GAME_LEFT[i]){
                    approved =  approved + 1;
                    }
                }
            for(let i = 0; i< GAME_BOTTOM.length; i++){
                if(locationTemp != GAME_BOTTOM[i]){
                    approved =  approved + 1;
                    }
                }
            
            if(GAME[locationTemp].color == gameTurn && returnArray.length == 0){
                return returnArray;
            }
            else if(GAME[locationTemp].color == gameTurn && returnArray.length >= 0){
                GAME[location].disabled = false;
                return returnArray;
            }
            else if(GAME[locationTemp].color == 'blank' && returnArray.length >= 0){
                returnArray = [];
                return returnArray;
            }
            else if(GAME[locationTemp].color != gameTurn && GAME[locationTemp].color != 'blank'){
                returnArray.push(locationTemp);
                if(approved != 16){
                    returnArray = [];
                    return returnArray;
                }
            }
            else{
                returnArray = [];
                return returnArray;
            }
            locationTemp = locationTemp + jumpNum;
        }
    }

    else if(jumpNum == -7){
        for(let i = 0; i< GAME_RIGHT.length; i++){
            if(location == GAME_RIGHT[i]){
                returnArray = [];
                return returnArray;
            }
        }
        for(let i = 0; i< GAME_TOP.length; i++){
            if(location == GAME_TOP[i]){
                returnArray = [];
                return returnArray;
            }
        }

        while(locationTemp <= 63){
            let approved = 0;

            for(let i = 0; i< GAME_RIGHT.length; i++){
                if(locationTemp != GAME_RIGHT[i]){
                    approved =  approved + 1;
                    }
                }
            for(let i = 0; i< GAME_TOP.length; i++){
                if(locationTemp != GAME_TOP[i]){
                    approved =  approved + 1;
                    }
                }
            
            if(GAME[locationTemp].color == gameTurn && returnArray.length == 0){
                return returnArray;
            }
            else if(GAME[locationTemp].color == gameTurn && returnArray.length >= 0){
                GAME[location].disabled = false;
                return returnArray;
            }
            else if(GAME[locationTemp].color == 'blank' && returnArray.length >= 0){
                returnArray = [];
                return returnArray;
            }
            else if(GAME[locationTemp].color != gameTurn && GAME[locationTemp].color != 'blank'){
                returnArray.push(locationTemp);
                if(approved != 16){
                    returnArray = [];
                    return returnArray;
                }
            }
            else{
                returnArray = [];
                return returnArray;
            }
            locationTemp = locationTemp + jumpNum;
        }
    }

    else if(jumpNum == -9){
        for(let i = 0; i< GAME_LEFT.length; i++){
            if(location == GAME_LEFT[i]){
                returnArray = [];
                return returnArray;
            }
        }
        for(let i = 0; i< GAME_TOP.length; i++){
            if(location == GAME_TOP[i]){
                returnArray = [];
                return returnArray;
            }
        }

        while(locationTemp >= 0){
            let approved = 0;

            for(let i = 0; i< GAME_LEFT.length; i++){
                if(locationTemp != GAME_LEFT[i]){
                    approved =  approved + 1;
                    }
                }
            for(let i = 0; i< GAME_TOP.length; i++){
                if(locationTemp != GAME_TOP[i]){
                    approved =  approved + 1;
                    }
                }
            
            if(GAME[locationTemp].color == gameTurn && returnArray.length == 0){
                return returnArray;
            }
            else if(GAME[locationTemp].color == gameTurn && returnArray.length >= 0){
                GAME[location].disabled = false;
                return returnArray;
            }
            else if(GAME[locationTemp].color == 'blank' && returnArray.length >= 0){
                returnArray = [];
                return returnArray;
            }
            else if(GAME[locationTemp].color != gameTurn && GAME[locationTemp].color != 'blank'){
                returnArray.push(locationTemp);
                if(approved != 16){
                    returnArray = [];
                    return returnArray;
                }
            }
            else{
                returnArray = [];
                return returnArray;
            }
            locationTemp = locationTemp + jumpNum;
        }
    }
}