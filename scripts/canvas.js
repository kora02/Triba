const canvas = document.querySelector('#platno');
const ctx = canvas.getContext("2d");

let choice = -1; //varijabla predstavlja izbor oblika ploce
let grid = []; //ovaj niz ce nam sluziti da cuvamo koordinate svakog kruga na kanvasu, kao i boju svakog kruga
let currentColor = "orange"; //trenutna boja igraca (narandzasta za igraca A, plava za igraca B)
let rows = 0;
let columns = 0;
let selectedPoints = []; //niz koji cuva tacke koje su trenutno odabrane (najvise mogu biti 3)
let drawnLines = [];  //niz koji cuva sve segmente koji su nacrtani
let playedMoves = []; //niz koji cuva sve odigrane poteze (trouglove), koristimo ga da bi mogli ponovo iscrtati kanvas kada mu se promijeni sirina (bitno za responzivnost) 
let circleRadius = 14; //poluprecnik kruga
let gameOver = false;
let firstPlayer = "A";
canvas.height = 0;
canvas.width = 0;

const startButton = document.querySelector('#start');

// Event listener za zapocinjanje igre
startButton.addEventListener('click', () => {
    let isChosen = false;
    const inputs = document.querySelectorAll('#izbor input[type="radio"]');
    for(let input of inputs) 
        if(input.checked) {
            isChosen = true;
            switch(input.value) {
                case '1':
                    choice = 1;
                    rows = 10;
                    columns = 8;
                    break;
                case '2':
                    choice = 2;
                    rows = 6;
                    columns = 8;
                    break;
                case '3':
                    choice = 3;
                    rows = 10;
                    columns = 10;
                    break;
                case '4':
                    choice = 4;
                    rows = 9;
                    columns = 9;
                    break;
                default:
                    return; 
            }
        }

        if(!isChosen) return;

        for(let input of inputs) input.checked = false;
        firstPlayer = "A";
        makeNewGame(choice);
});


//kreiramo novu igru
function makeNewGame(choice) {

    document.getElementById("BPotez").classList.remove("aktivna-poruka");
    document.getElementById("APotez").classList.remove("aktivna-poruka");
    document.getElementById("APobjeda").classList.remove("aktivna-poruka");
    document.getElementById("BPobjeda").classList.remove("aktivna-poruka");
    document.getElementById("NedozvoljenPotez").classList.remove("aktivna-poruka");
    document.getElementById("igrajPonovo").classList.remove("kraj-igre");

    if(firstPlayer === "A") {
        currentColor = 'orange';
        document.getElementById("APotez").classList.add("aktivna-poruka");
        
    }
    else {
        currentColor = 'blue';
        document.getElementById("BPotez").classList.add("aktivna-poruka");
    }

    grid = [];
    selectedPoints = [];
    drawnLines = [];
    playedMoves = [];
    gameOver = false;

    grid = new Array(rows);
    for(let i = 0; i < rows; i++) grid[i] = new Array(columns);
    for(let i = 0; i < rows; i++)
        for(let j = 0; j < columns; j++) {
            grid[i][j] = new Array(3);
            grid[i][j][0] = 0;
            grid[i][j][1] = 0;
            grid[i][j][2] = 'gray';

        }
    adjustCanvasSize();
    initializeBoard();
}

//pravimo plocu
function initializeBoard() {
    for(let i = 0; i < rows; i++) {
        for(let j = 0; j < columns; j++) {
            if(choice === 1) {
                drawCircle((j+1)/(columns+1) * canvas.width, (i+1)/(rows+1) * canvas.height, circleRadius, "gray");
                grid[i][j][0] = (j+1)/(columns+1) * canvas.width;
                grid[i][j][1] = (i+1)/(rows+1) * canvas.height;
                drawLine(0, 1/(rows+1) * canvas.height*1.25, 0, rows/(rows+1) * canvas.height, currentColor);
                drawLine(canvas.width, 1/(rows+1) * canvas.height*1.25, canvas.width, rows/(rows+1) * canvas.height, currentColor);
            } else if(choice === 3) {
                drawCircle((j+1)/(columns+1) * canvas.width, (i+1)/(rows+1) * canvas.height, circleRadius, "gray");
                grid[i][j][0] = (j+1)/(columns+1) * canvas.width;
                grid[i][j][1] = (i+1)/(rows+1) * canvas.height;
                drawLine(0, 1/(columns+1) * canvas.height, 0, columns/(columns+1) * canvas.height, currentColor);
                drawLine(canvas.width, 1/(columns+1) * canvas.height, canvas.width, columns/(columns+1) * canvas.height, currentColor);
            } else if(choice === 2) {
                drawCircle((j+1)/(columns+1) * canvas.width, (i+1)/(rows+1) * canvas.height * 0.75, circleRadius, "gray");
                grid[i][j][0] = (j+1)/(columns+1) * canvas.width;
                grid[i][j][1] = (i+1)/(rows+1) * canvas.height * 0.75;
                drawLine(0, 1/(columns+1) * canvas.height, 0, rows/(rows+1) * canvas.height*0.75, currentColor);
                drawLine(canvas.width, 1/(columns+1) * canvas.height, canvas.width, rows/(rows+1) * canvas.height *  0.75, currentColor);
            } else if(choice === 4) {
                let num1, num2;
                if(i <= (rows-1)/2) {
                    num1 = (rows-1)/2 - i;
                    num2 = (rows-1)/2 + i;
                }
                else {
                    num1 = i - (rows-1)/2;
                    num2 = rows-1 - i + (rows-1)/2;
                }
                if(j >= num1 && j <= num2) {
                    drawCircle((j+1)/(columns+1) * canvas.width, (i+1)/(rows+1) * canvas.height, circleRadius, "gray");
                    grid[i][j][0] = (j+1)/(columns+1) * canvas.width;
                    grid[i][j][1] = (i+1)/(rows+1) * canvas.height;
                    drawLine(0, 1/(columns+1) * canvas.height, 0, columns/(columns+1) * canvas.height, currentColor);
                    drawLine(canvas.width, 1/(columns+1) * canvas.height, canvas.width, columns/(columns+1) * canvas.height, currentColor);
                }
                else grid[i][j] = null;
            }
            
        }
    }
    for(let i = 0; i < grid.length; i++) {
        for(let j = 0; j < grid[i].length; j++) {
            if(grid[i][j] !== null) drawCircle(grid[i][j][0], grid[i][j][1], circleRadius, grid[i][j][2]);
        }
    } 
}


//Event listener za klik na kanvas - potrebno je detektovati na koji krug je kliknuto
canvas.addEventListener('click', (e) => {
    if(gameOver) return;
    let elemLeft = canvas.offsetLeft + canvas.clientLeft;
    let elemTop = canvas.offsetTop + canvas.clientTop;

    let x = e.pageX - elemLeft;
    let y = e.pageY - elemTop;

    selectPoint(x, y);

    if(selectedPoints.length === 3) {
        let x1 = selectedPoints[0][0];
        let y1 = selectedPoints[0][1];
        let x2 = selectedPoints[1][0];
        let y2 = selectedPoints[1][1];
        let x3 = selectedPoints[2][0];
        let y3 = selectedPoints[2][1];
        
        //provjeravamo da li je potez validan
        if(!checkIsMoveValid(x1, y1, x2, y2, x3, y3)) {
            grid[x1][y1][2] = "gray";
            grid[x2][y2][2] = "gray";
            grid[x3][y3][2] = "gray";
            document.getElementById('NedozvoljenPotez').classList.add('aktivna-poruka');
            setTimeout(() => {
                document.getElementById('NedozvoljenPotez').classList.remove('aktivna-poruka');
            }, 700);
        }
        else {
            playMove(x1, y1, x2, y2, x3, y3)
            canvas.style.cursor = "default";

            //provjeravamo da li je igra zavrsila
            gameOver = checkIsGameOver();
            if(gameOver) {
                document.getElementById("APotez").classList.remove("aktivna-poruka");
                document.getElementById("BPotez").classList.remove("aktivna-poruka");
                if(currentColor === "blue") {
                    document.getElementById("APobjeda").classList.add("aktivna-poruka");
                }
                else {
                    document.getElementById("BPobjeda").classList.add("aktivna-poruka");
                }
                document.getElementById("igrajPonovo").classList.add("kraj-igre");

                currentColor = "green";
                repaintCanvas();
            }

        }
        selectedPoints = [];
    }
    
    repaintCanvas();
});

//pomocna funkcija, detektuje krug na koji je kliknuto
function selectPoint(x, y) {
    for(let i = 0; i < rows; i++)
        for(let j = 0; j < columns; j++) {
            if(grid[i][j] !== null && pointsDistance(grid[i][j][0], grid[i][j][1], x, y) <= circleRadius && grid[i][j][2] != "red") {
                grid[i][j][2] = currentColor;
                for(let k = 0; k < selectedPoints.length; k++) 
                    if(i === selectedPoints[k][0] && j === selectedPoints[k][1]) {
                        selectedPoints.splice(k, 1);
                        grid[i][j][2] = "gray";
                            
                    }
                
                drawCircle(grid[i][j][0], grid[i][j][1], circleRadius, currentColor);

                if(grid[i][j][2] !== 'gray') selectedPoints.push([i, j]);
            }
        }   
}

//pomocna funkcija, iscrtava trougao
function playMove(x1, y1, x2, y2, x3, y3) {
    drawTriangle(grid[x1][y1][0], grid[x1][y1][1], grid[x2][y2][0], grid[x2][y2][1], grid[x3][y3][0], grid[x3][y3][1],  currentColor);
    playedMoves.push([selectedPoints[0][0], selectedPoints[0][1], selectedPoints[1][0], selectedPoints[1][1], selectedPoints[2][0], selectedPoints[2][1], currentColor]);
    if(currentColor === 'orange') {
        currentColor = 'blue';
        changePlayerTo("B");
    }
    else if(currentColor === 'blue') {
        currentColor ='orange';
        changePlayerTo("A");
    }
    grid[x1][y1][2] = "red";
    grid[x2][y2][2] = "red";
    grid[x3][y3][2] = "red";

    for(let i = 0; i < rows; i++) {
        for(let j = 0; j < columns; j++) {
            if(grid[i][j] != null && (isPointOnSegment(x1, y1, x2, y2, i, j) || isPointOnSegment(x2, y2, x3, y3, i, j) || isPointOnSegment(x1, y1, x3, y3, i, j)))
               grid[i][j][2] = "red";
        }
    }
    drawnLines.push([x1, y1, x2, y2]);
    drawnLines.push([x2, y2, x3, y3]);
    drawnLines.push([x3, y3, x1, y1]);
}

//
function changePlayerTo(player) {
    document.getElementById("NedozvoljenPotez").classList.remove("aktivna-poruka");
    if(player === "B") {
        document.getElementById("APotez").classList.remove("aktivna-poruka");
        document.getElementById("BPotez").classList.add("aktivna-poruka");
    }
    else {
        document.getElementById("BPotez").classList.remove("aktivna-poruka");
        document.getElementById("APotez").classList.add("aktivna-poruka");
    }
}
 


//funkcija za ponovno iscrtavanje kanvasa
function repaintCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initializeBoard();
    for(move of playedMoves) {
        drawTriangle(grid[move[0]][move[1]][0], grid[move[0]][move[1]][1], grid[move[2]][move[3]][0], grid[move[2]][move[3]][1], 
            grid[move[4]][move[5]][0], grid[move[4]][move[5]][1], move[6]);
    }

}
/*
    Da bi postigli responzivnost kanvasa potrebno je da prilikom promjene sirine/visine ekrana, podesimo
    sirinu i visinu kanvasa. Zbog toga je potrebno svaki put ponovo nacrtati sve odigrane poteze. Zbog toga,
    odigrane poteze (tj. nacrtane trouglove) cuvamo u nizu playedMoves;

*/
window.addEventListener('resize', (e) => {
    if(canvas.width === 0 && canvas.height === 0) return;
    adjustCanvasSize();
    repaintCanvas();
});

//skaliramo velicinu kanvasa i poluprecnika krugova, kako bi ostvarili responzivnost
function adjustCanvasSize() {
    canvas.width = window.innerWidth * 0.5;
    canvas.height = window.innerWidth * 0.5;
    circleRadius = 14;
    if(choice === 3) {
        canvas.width = window.innerWidth * 0.52;
        canvas.height = window.innerWidth * 0.52;
        circleRadius = 12;
    }
    if(window.innerWidth <= 400) {
        canvas.width = window.innerWidth * 0.85;
        canvas.height = window.innerWidth * 0.85;
        circleRadius = 5;
    }
    else if(window.innerWidth <= 600) {
        canvas.width = window.innerWidth * 0.85;
        canvas.height = window.innerWidth * 0.95;
        circleRadius = 10;
        if(choice === 3) circleRadius = 8;
    }
    else if(window.innerWidth <= 1200) {
        canvas.width = window.innerWidth * 0.75;
        canvas.height = window.innerWidth * 0.75;
        circleRadius = 12;
        if(choice === 3) circleRadius = 10;
    }
}


//kada zavrsi igra, trebamo ponuditi opciju igracima da ponovo igraju
const restartButton = document.getElementById("restart");

restartButton.addEventListener("click", () => {
    if(firstPlayer === 'A') firstPlayer = 'B';
    else firstPlayer = 'A';

    document.getElementById("APobjeda").classList.remove("aktivna-poruka");
    document.getElementById("BPobjeda").classList.remove("aktivna-poruka");
    document.getElementById("igrajPonovo").classList.remove("kraj-igre");

    makeNewGame(choice);
});

canvas.addEventListener('mousemove', (e) => {
    if(gameOver) return;
    let elemLeft = canvas.offsetLeft + canvas.clientLeft;
    let elemTop = canvas.offsetTop + canvas.clientTop;

    let x = e.pageX - elemLeft;
    let y = e.pageY - elemTop;

    let isOnCircle = false;

    for(let i = 0; i < rows; i++)
        for(let j = 0; j < columns; j++) {
            if(grid[i][j] !== null && pointsDistance(grid[i][j][0], grid[i][j][1], x, y) <= circleRadius && grid[i][j][2] != "red") {
                canvas.style.cursor = "pointer";
                isOnCircle = true;
            }
        }
        
        if(!isOnCircle) canvas.style.cursor = "default";
})



