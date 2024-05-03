//funkcija za crtanje kruga
function drawCircle(x, y, radius, Color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2*Math.PI);
    ctx.fillStyle = Color;
    ctx.fill();
    ctx.closePath();
}

//funkcija za crtanje linije
function drawLine(x1, y1, x2, y2, currentColor) {
    ctx.beginPath();
    ctx.lineWidth = 10;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = currentColor;
    ctx.stroke();
    ctx.lineWidth = 3;
    ctx.closePath();
}

//funkcija za crtanje trougla
function drawTriangle(x1, y1, x2, y2, x3, y3, currentColor) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.moveTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.moveTo(x3, y3);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = currentColor;
    ctx.stroke();
}