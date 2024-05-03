// funkcija provjerava da li tacka (x3, y3) pripada duzi sa krajnjim tackama (x1,y1) i (x2, y2)
function isPointOnSegment(x1, y1, x2, y2, x3, y3) {
    if(x3 >= Math.min(x1, x2) && x3 <= Math.max(x1, x2) && y3 >= Math.min(y1, y2) && y3 <= Math.max(y1, y2)) {
        return (y3 - y1)*(x2 - x1) === (y2 - y1)*(x3 - x1); 
    }

    return false;
}


//orijentacija tacaka (ovo ce biti korisno za provjeru uslova da li se dva segmenta sijeku)
function orientationOfPoints(x1, y1, x2, y2, x3, y3) {
    if((y2 - y1)*(x3-x2) > (x2-x1)*(y3-y2)) return true;
    return false;
}


// funkcija koja provjerava da li se novi trougao sijece sa nekim vec nacrtanim
function doTrianglesIntersect(x1, y1, x2, y2, x3, y3) {
    for(let line of drawnLines) {
        let x4 = line[0];
        let y4 = line[1];
        let x5 = line[2];
        let y5 = line[3];
        if((orientationOfPoints(x1, y1, x2, y2, x4, y4) != orientationOfPoints(x1, y1, x2, y2, x5, y5) && 
            orientationOfPoints(x4, y4, x5, y5, x1, y1) != orientationOfPoints(x4, y4, x5, y5, x2, y2))
          || 
          (orientationOfPoints(x2, y2, x3, y3, x4, y4) != orientationOfPoints(x2, y2, x3, y3, x5, y5) && 
          orientationOfPoints(x4, y4, x5, y5, x2, y2) != orientationOfPoints(x4, y4, x5, y5, x3, y3))
          ||
          (orientationOfPoints(x1, y1, x3, y3, x4, y4) != orientationOfPoints(x1, y1, x3, y3, x5, y5) && 
          orientationOfPoints(x4, y4, x5, y5, x1, y1) != orientationOfPoints(x4, y4, x5, y5, x3, y3))
        )
            return true;

        else if(isPointOnSegment(x1, y1, x2, y2, x4, y4) || isPointOnSegment(x1, y1, x3, y3, x4, y4) || isPointOnSegment(x2, y2, x3, y3, x4, y4) ||
        isPointOnSegment(x1, y1, x2, y2, x5, y5) || isPointOnSegment(x1, y1, x3, y3, x5, y5) || isPointOnSegment(x2, y2, x3, y3, x5, y5))
            return true;
    }

    return false;
}

//udaljenost tacaka
function pointsDistance(x1, y1, x2, y2) {
    return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
}


//funkcija koja provjerava da li je igra zavrsena
function checkIsGameOver() {
    for(let i = 0; i < rows; i++) 
        for(let j = 0; j < columns; j++) 
            if(grid[i][j] !== null && grid[i][j][2] === 'gray') 
                for(let k = i; k < rows; k++) 
                    for(let l = 0; l < columns; l++) 
                        if(grid[k][l] !== null && grid[k][l][2] === 'gray' && (k > i || l > j)) 
                            for(let m = k; m < rows; m++) 
                                for(let n = 0; n < columns; n++) 
                                    if(grid[m][n] !== null && grid[m][n][2] === 'gray' && (m > k || n > l)) 
                                        if(checkIsMoveValid(i, j, k, l, m, n)) 
                                            return false;
        return true;
}

//provjeravamo da li je odigrani potez validan
function checkIsMoveValid(x1, y1, x2, y2, x3, y3) {
    if(!doTrianglesIntersect(x1, y1, x2, y2, x3, y3) && !(isPointOnSegment(x1, y1, x2, y2, x3, y3) || 
    isPointOnSegment(x1, y1, x3, y3, x2, y2) || isPointOnSegment(x3, y3, x2, y2, x1, y1)))
        return true;

    return false;
}


