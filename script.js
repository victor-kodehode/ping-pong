const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.style.backgroundColor = 'black';

// used to terminate the game
let game_over = false;
let winner = 0;

// toggle developer mode
const dev_mode = false;

// general ball
const ball = {
    r: 16,
};
// general rectangle
const rect = {
    s: 20,
    w: 10,
    l: 100,
    v: 4,
};
// specific ball 1
const speed = 3;
let angle = (Math.PI*Math.floor(2*Math.random())) + (Math.PI/2)*Math.random() - (Math.PI/4);
let ball1 = {
    x: Math.floor(canvas.width/2),
    y: Math.floor(canvas.height/2),
    dx: speed*Math.cos(angle),
    dy: speed*Math.sin(angle),
};
// specific rectangle 1
let rect1 = {
    nx: rect.s,
    px: rect.s+rect.w,
    ny: Math.floor(canvas.height/2)-50,
    py: Math.floor(canvas.height/2)-50+rect.l,
    dy: 0,
};
// specific rectangle 2
let rect2 = {
    nx: canvas.width-rect.s-rect.w,
    px: canvas.width-rect.s,
    ny: Math.floor(canvas.height/2)-50,
    py: Math.floor(canvas.height/2)-50+rect.l,
    dy: 0,
};

const validKeys = ['w','s'];

let controller = {
    w:false,
    s:false
};

window.addEventListener('keydown',e=>{
    if(validKeys.includes(e.key)){
        controller[e.key] = true;
    }
});

window.addEventListener('keyup',e=>{
    if(validKeys.includes(e.key)){
        controller[e.key] = false;
    }
});

function reset() {
    ball1.x = Math.floor(canvas.width/2);
    ball1.y = Math.floor(canvas.height/2);
    angle = (Math.PI*Math.floor(2*Math.random())) + (Math.PI/2)*Math.random() - (Math.PI/4);
    ball1.dx = speed*Math.cos(angle);
    ball1.dy = speed*Math.sin(angle);
    rect1.ny = Math.floor(canvas.height/2) - rect.l/2;
    rect2.ny = Math.floor(canvas.height/2) - rect.l/2;
    rect1.py = rect1.ny + rect.l;
    rect2.py = rect2.ny + rect.l;
}

function draw() {
    ctx.beginPath();
    ctx.fillStyle = 'green';
    ctx.arc(ball1.x,ball1.y,ball.r,0,2*Math.PI);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = 'blue';
    ctx.fillRect(rect1.nx,rect1.ny,rect.w,rect.l);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.fillRect(rect2.nx,rect2.ny,rect.w,rect.l);
    ctx.fill();
    ctx.closePath();
    if ( dev_mode ) {
        ctx.beginPath();
        ctx.arc(ball1.x, ball1.y, 1, 0, 2*Math.PI);
        ctx.moveTo(rect1.px+ball.r,rect1.ny);
        ctx.arc(rect1.px, rect1.py, ball.r, 0, Math.PI/2);
        ctx.arc(rect1.nx, rect1.py, ball.r, Math.PI/2, Math.PI);
        ctx.arc(rect1.nx, rect1.ny, ball.r, Math.PI, 3*Math.PI/2);
        ctx.arc(rect1.px, rect1.ny, ball.r, 3*Math.PI/2, 2*Math.PI);
        ctx.moveTo(rect2.px+ball.r,rect2.ny);
        ctx.arc(rect2.px, rect2.py, ball.r, 0, Math.PI/2);
        ctx.arc(rect2.nx, rect2.py, ball.r, Math.PI/2, Math.PI);
        ctx.arc(rect2.nx, rect2.ny, ball.r, Math.PI, 3*Math.PI/2);
        ctx.arc(rect2.px, rect2.ny, ball.r, 3*Math.PI/2, 2*Math.PI);
        ctx.moveTo(ball.r, ball.r);
        ctx.lineTo(canvas.width - ball.r, ball.r);
        ctx.lineTo(canvas.width - ball.r, canvas.height - ball.r);
        ctx.lineTo(ball.r, canvas.height - ball.r);
        ctx.lineTo(ball.r, ball.r);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.closePath();
    }
}

function intersectF(rect0_x,rect0_dy,rect0_ny,rect0_py,ball_r) {
    const a = rect0_x + ball_r;
    const b = ball1.x + ball1.dx;
    const c = ball1.y + (ball1.dy + rect0_dy) * (a - ball1.x) / ball1.dx;
    const d = ball1.x;
    if((b < a) && (a <= d) || (b > a) && (a >= d)){
        if(rect0_ny <= c && c <= rect0_py){
            return true;
        }
    }
    return false;
}

function safe() {
    let boolX1 = rect1.px + ball.r < ball1.x && ball1.x < rect2.nx - ball.r;
    let boolX2 = rect1.px + ball.r < ball1.x + ball1.dx && ball1.x + ball1.dx < rect2.nx - ball.r;
    let boolY1 = ball.r < ball1.y && ball1.y < canvas.height - ball.r;
    let boolY2 = ball.r < ball1.y + ball1.dy && ball1.y + ball1.dy < canvas.height - ball.r;
    return boolX1 && boolX2 && boolY1 && boolY2;
}

function move() {
    let ready = false;
    while(!ready){
        if(safe()){
            ball1.x += ball1.dx;
            ball1.y += ball1.dy;
            rect1.ny += rect1.dy;
            rect1.py += rect1.dy;
            rect2.ny += rect2.dy;
            rect2.py += rect2.dy;
            ready = true;
        }
        else if(ball1.y>=ball.r && ball1.y+ball1.dy<ball.r){
            ball1.y += ball1.dy;
            ball1.y = 2*ball.r - ball1.y;
            ball1.dy *= -1;
        }
        else if(ball1.y<=canvas.height-ball.r && ball1.y+ball1.dy>canvas.height-ball.r){
            ball1.y += ball1.dy;
            ball1.y = 2*(canvas.height - ball.r) - ball1.y;
            ball1.dy *= -1;
        }
        else if(intersectF(rect1.px,rect1.dy,rect1.ny,rect1.py,ball.r)){
            ball1.x += ball1.dx;
            ball1.x = 2*(rect1.px + ball.r) - ball1.x - ball1.dx;
            ball1.dx *= -1;
        }
        else if(ball1.x+ball1.dx<ball.r){
            game_over = true;
            winner = 2;
            ready = true;
        }
        else if(intersectF(rect2.nx,rect2.dy,rect2.ny,rect2.py,-ball.r)){
            ball1.x += ball1.dx;
            ball1.x = 2*(rect2.nx - ball.r) - ball1.x - ball1.dx;
            ball1.dx *= -1;
        }
        else if(ball1.x+ball1.dx>canvas.width-ball.r){
            game_over = true;
            winner = 1;
            ready = true;
        }
        else{
            ball1.x += ball1.dx;
            ball1.y += ball1.dy;
            rect1.ny += rect1.dy;
            rect1.py += rect1.dy;
            rect2.ny += rect2.dy;
            rect2.py += rect2.dy;
            ready = true;
        }
    }
    ready = false;
}

async function game(){
    while(true){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        if(controller.w && !controller.s){
            rect1.dy = -rect.v;
            if(rect1.ny <= 0){
                rect1.ny = 0;
                rect1.py = rect.l;
                rect1.dy = 0;
            }
        }else if(!controller.w && controller.s){
            rect1.dy = rect.v;
            if(rect1.py >= canvas.height){
                rect1.py = canvas.height;
                rect1.ny = canvas.height - rect.l;
                rect1.dy = 0;
            }
        }else{
            rect1.dy = 0;
        }
        if(ball1.y < rect2.ny + rect.l/2){
            rect2.dy = -rect.v;
            if(rect2.ny <= 0){
                rect2.ny = 0;
                rect2.py = rect.l;
                rect2.dy = 0;
            }
        }else if(ball1.y > rect2.ny + rect.l/2){
            rect2.dy = rect.v;
            if(rect2.py >= canvas.height){
                rect2.py = canvas.height;
                rect2.ny = canvas.height - rect.l;
                rect2.dy = 0;
            }
        }else{
            rect2.dy = 0;
        }
        move();
        if ( game_over ) {
            if(winner===1){
                console.log("VICTORY");
            }else{
                console.log("DEFEAT");
            }
            game_over = false;
            winner = 0;
            reset();
            ctx.clearRect(0,0,canvas.width,canvas.height);
            move();
        }
        draw();
        await new Promise(resolve => setTimeout(resolve, 10));
    }
}

game();
