const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.style.backgroundColor = 'black';



// used to terminate the game
let game_over = false;

// toggle developer mode
const dev_mode = true;

// customize the ball
const ball_radius = 16;

// customize the rectangles
const rectangle_length = 100;
const rectangle_width = 10;
const rectangle_space = 20;
const rectangle_speed = 4;

// global ball variables
let ball_x = Math.floor(canvas.width/2);
let ball_y = Math.floor(canvas.height/2);
let start_angle = 2*Math.PI*Math.random();
let ball_dx = 5*Math.cos(start_angle);
let ball_dy = 5*Math.sin(start_angle);

// global rectangle variables
const rectangle1_x_left = rectangle_space;
const rectangle2_x_left = canvas.width - rectangle_space - rectangle_width;
let rectangle1_y_top = Math.floor(canvas.height/2) - 50;
let rectangle2_y_top = Math.floor(canvas.height/2) - 50;

// ball object...
let ball = {
    r: 16,
    x: Math.floor(canvas.width/2),
    y: Math.floor(canvas.height/2),
    dx: Math.cos(2*Math.PI*Math.random()),
    dy: Math.sin(2*Math.PI*Math.random()),
}

// rect object...

// rect object...

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
    const unsafe_distance = rectangle_space + rectangle_width + ball_radius;
    const ball_safe_before = (unsafe_distance < ball.x < canvas.width - unsafe_distance);
    const ball_safe_after = (unsafe_distance < ball.x + ball.dx < canvas.width - unsafe_distance);
    return ball_safe_before && ball_safe_after;
}

function move() {
    if ( isSafe() ) {
        ball.x += ball.dx;
        ball.y += ball.dy;
        if ( ball.y < ball.r ) {
            ball.y += 2*(ball.r - ball.y);
            ball.dy *= -1;
        }
        if ( ball.y > canvas.height - ball.r ) {
            ball.y -= 2*(ball.y - canvas.height + ball.r);
            ball.dy *= -1;
        }
    }
    let num1 = rectangle_space + rectangle_width + ball.r;
    let bool1 = ball.x > num1;
    bool1 = bool1 && (ball.x + ball.dx < num1);
    let slope_min = (rectangle1_y_top - ball.y)/Math.abs(num1 - ball.x);
    let slope = ball.dy/Math.abs(ball.dx);
    let slope_max = (rectangle1_y_top+rectangle_length - ball.y)/Math.abs(num1 - ball.x);
    bool1 = bool1 && (slope_min < slope < slope_max);
    if ( bool1 ) {
        ball.x += ball.dx;
        ball.x += 2*(num1 - ball.x);
        ball.dx *= -1;
    }
    if ( ball.x + ball.dx < ball.r || ball.x + ball.dx > canvas.width - ball.r ) {
        game_over = true;
    }
}

function reset() {
    ball.x = Math.floor(canvas.width/2);
    ball.y = Math.floor(canvas.height/2);
    start_angle = 2*Math.PI*Math.random();
    ball.dx = 5*Math.cos(start_angle);
    ball.dy = 5*Math.sin(start_angle);
    rectangle1_y_top = Math.floor(canvas.height/2) - 50;
    rectangle2_y_top = Math.floor(canvas.height/2) - 50;
    game_over = false;
}

function draw() {
    ctx.beginPath();
    ctx.fillStyle = 'green';
    ctx.arc(ball_x,ball_y,ball_radius,0,2*Math.PI);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = 'blue';
    ctx.fillRect(rectangle_space,rectangle1_y_top,rectangle_width,rectangle_length);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.fillRect(canvas.width-rectangle_space-rectangle_width,rectangle2_y_top,rectangle_width,rectangle_length);
    ctx.fill();
    ctx.closePath();
    if(dev_mode){
        ctx.beginPath();
        ctx.arc(ball_x, ball_y, 1, 0, 2*Math.PI);
        ctx.moveTo(rectangle_space + rectangle_width + ball_radius, rectangle1_y_top);
        ctx.lineTo(rectangle_space + rectangle_width + ball_radius, rectangle1_y_top + rectangle_length);
        ctx.arc(rectangle_space + rectangle_width, rectangle1_y_top + rectangle_length, ball_radius, 0, Math.PI/2);
        ctx.lineTo(rectangle_space, rectangle1_y_top + rectangle_length + ball_radius);
        ctx.arc(rectangle_space, rectangle1_y_top + rectangle_length, ball_radius, Math.PI/2, Math.PI);
        ctx.lineTo(rectangle_space - ball_radius, rectangle1_y_top);
        ctx.arc(rectangle_space, rectangle1_y_top, ball_radius, Math.PI, 3*Math.PI/2);
        ctx.lineTo(rectangle_space + rectangle_width, rectangle1_y_top - ball_radius);
        ctx.arc(rectangle_space + rectangle_width, rectangle1_y_top, ball_radius, 3*Math.PI/2, 2*Math.PI);
        const addThis = canvas.width - 2*rectangle_space - rectangle_width;
        ctx.moveTo(addThis + rectangle_space + rectangle_width + ball_radius, rectangle1_y_top);
        ctx.lineTo(addThis + rectangle_space + rectangle_width + ball_radius, rectangle1_y_top+ rectangle_length);
        ctx.arc(addThis + rectangle_space + rectangle_width, rectangle1_y_top + rectangle_length, ball_radius, 0, Math.PI/2);
        ctx.lineTo(addThis + rectangle_space, rectangle1_y_top + rectangle_length + ball_radius);
        ctx.arc(addThis + rectangle_space, rectangle1_y_top + rectangle_length, ball_radius, Math.PI/2, Math.PI);
        ctx.lineTo(addThis + rectangle_space - ball_radius, rectangle1_y_top);
        ctx.arc(addThis + rectangle_space, rectangle1_y_top, ball_radius, Math.PI, 3*Math.PI/2);
        ctx.lineTo(addThis + rectangle_space + rectangle_width, rectangle1_y_top - ball_radius);
        ctx.arc(addThis + rectangle_space + rectangle_width, rectangle1_y_top, ball_radius, 3*Math.PI/2, 2*Math.PI);
        ctx.moveTo(ball_radius, ball_radius);
        ctx.lineTo(canvas.width - ball_radius, ball_radius);
        ctx.lineTo(canvas.width - ball_radius, canvas.height - ball_radius);
        ctx.lineTo(ball_radius, canvas.height - ball_radius);
        ctx.lineTo(ball_radius, ball_radius);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.closePath();
    }
}

async function game(){
    while(true){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        move();
        if ( game_over ) {
            reset();
            ctx.clearRect(0,0,canvas.width,canvas.height);
            move();
        }
        draw();
        await new Promise(resolve => setTimeout(resolve, 10));
    }
}

// game();