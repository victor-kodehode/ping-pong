const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.style.backgroundColor = 'black';

// used to terminate the game
let game_over = false;

// toggle developer mode
const dev_mode = true;

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
let ball1 = {
    x: Math.floor(canvas.width/2),
    y: Math.floor(canvas.height/2),
    dx: Math.cos(2*Math.PI*Math.random()),
    dy: Math.sin(2*Math.PI*Math.random()),
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

let d = [0,0,0,0];

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

function isSafe() {
    const unsafe_distance = rect.s + rect.w + ball.r;
    const ball_safe_before = (unsafe_distance < ball1.x < canvas.width - unsafe_distance);
    const ball_safe_after = (unsafe_distance < ball1.x + ball1.dx < canvas.width - unsafe_distance);
    return ball_safe_before && ball_safe_after;
}

function move() {
    if ( isSafe() ) {
        ball1.x += ball1.dx;
        ball1.y += ball1.dy;
        if ( ball1.y < ball.r ) {
            ball1.y += 2*(ball.r - ball1.y);
            ball1.dy *= -1;
        }
        if ( ball1.y > canvas.height - ball.r ) {
            ball1.y -= 2*(ball1.y - canvas.height + ball.r);
            ball1.dy *= -1;
        }
    }
    let num1 = rect.s + rect.w + ball.r;
    let bool1 = ball1.x > num1;
    bool1 = bool1 && (ball1.x + ball1.dx < num1);
    let slope_min = (rect1.ny - ball1.y)/Math.abs(num1 - ball1.x);
    let slope = ball1.dy/Math.abs(ball1.dx);
    let slope_max = (rect1.ny + rect.l - ball1.y)/Math.abs(num1 - ball1.x);
    bool1 = bool1 && (slope_min < slope < slope_max);
    if ( bool1 ) {
        ball1.x += ball1.dx;
        ball1.x += 2*(num1 - ball1.x);
        ball1.dx *= -1;
    }
    if ( ball1.x + ball1.dx < ball.r || ball1.x + ball1.dx > canvas.width - ball.r ) {
        game_over = true;
    }
}

function reset() {
    ball1.x = Math.floor(canvas.width/2);
    ball1.y = Math.floor(canvas.height/2);
    ball1.dx = 2*Math.cos(2*Math.PI*Math.random());
    ball1.dy = 2*Math.sin(2*Math.PI*Math.random());
    rect1.ny = Math.floor(canvas.height/2) - 50;
    rect2.ny = Math.floor(canvas.height/2) - 50;
    game_over = false;
}

function collect() {
    if(controller.w){
        rect1.dy = -rect.v;
    }else if(controller.s){
        rect1.dy = rect.v;
    }
}

function predict() {
    // code
    ball1.x += ball1.dx;
    ball1.y += ball1.dy;
}

function draw() {
    ctx.beginPath();
    ctx.fillStyle = 'green';
    ctx.arc(ball1.x,ball1.y,ball.r,0,2*Math.PI);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = 'blue';
    ctx.fillRect(rect.s,rect1.ny,rect.w,rect.l);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.fillRect(canvas.width-rect.s-rect.w,rect2.ny,rect.w,rect.l);
    ctx.fill();
    ctx.closePath();
    if ( dev_mode ) {
        ctx.beginPath();
        ctx.arc(ball1.x, ball1.y, 1, 0, 2*Math.PI);
        ctx.moveTo(rect1.px + ball.r, rect1.ny);
        ctx.lineTo(rect1.px + ball.r, rect1.py);
        ctx.arc(rect1.px, rect1.py, ball.r, 0, Math.PI/2);
        ctx.lineTo(rect.s, rect1.py + ball.r);
        ctx.arc(rect.s, rect1.py, ball.r, Math.PI/2, Math.PI);
        ctx.lineTo(rect.s - ball.r, rect1.ny);
        ctx.arc(rect.s, rect1.ny, ball.r, Math.PI, 3*Math.PI/2);
        ctx.lineTo(rect1.px, rect1.ny - ball.r);
        ctx.arc(rect1.px, rect1.ny, ball.r, 3*Math.PI/2, 2*Math.PI);
        const addThis = canvas.width - 2*rect.s - rect.w;
        ctx.moveTo(addThis + rect1.px + ball.r, rect1.ny);
        ctx.lineTo(addThis + rect1.px + ball.r, rect1.ny+ rect.l);
        ctx.arc(addThis + rect1.px, rect1.py, ball.r, 0, Math.PI/2);
        ctx.lineTo(addThis + rect.s, rect1.py + ball.r);
        ctx.arc(addThis + rect.s, rect1.py, ball.r, Math.PI/2, Math.PI);
        ctx.lineTo(addThis + rect.s - ball.r, rect1.ny);
        ctx.arc(addThis + rect.s, rect1.ny, ball.r, Math.PI, 3*Math.PI/2);
        ctx.lineTo(addThis + rect1.px, rect1.ny - ball.r);
        ctx.arc(addThis + rect1.px, rect1.ny, ball.r, 3*Math.PI/2, 2*Math.PI);
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

async function game(){
    while(true){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        collect();
        predict();
        if ( game_over ) {
            reset();
            ctx.clearRect(0,0,canvas.width,canvas.height);
            move();
        }
        draw();
        await new Promise(resolve => setTimeout(resolve, 10));
    }
}

game();