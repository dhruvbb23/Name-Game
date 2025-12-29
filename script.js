/* CANVAS */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize(){
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);

document.body.tabIndex = 0;
document.body.focus();

/* NAME */
let playerName = prompt("Enter Your Name");
playerName = playerName ? playerName.toUpperCase() : "PLAYER";

/* COLORS */
const colors = ["#ff4d4d","#38bdf8","#22c55e","#a855f7","#f97316","#eab308"];
const randomColor = () => colors[Math.floor(Math.random()*colors.length)];

/* PADDLE */
const paddle = {
  w:150,
  h:14,
  x:canvas.width/2-75,
  y:canvas.height-50,
  speed:6
};

/* BALL */
let ball = {
  x:canvas.width/2,
  y:120,
  dx:1.4,
  dy:1.8,
  stick:0,
  color:randomColor(),
  glow:25
};

let score = 0, lives = 2, game = true;

/* SHOCKWAVE */
let waves = [];
function shockwave(x,y){
  waves.push({x,y,r:0,a:1});
}

/* CONTROLS */
let left=false, right=false;
addEventListener("keydown", e=>{
  if(e.key==="ArrowLeft") left=true;
  if(e.key==="ArrowRight") right=true;
});
addEventListener("keyup", e=>{
  if(e.key==="ArrowLeft") left=false;
  if(e.key==="ArrowRight") right=false;
});

/* DRAW PADDLE */
function drawPaddle(){
  ctx.fillStyle="#00eaff";
  ctx.shadowColor="#00eaff";
  ctx.shadowBlur=15;
  ctx.fillRect(paddle.x,paddle.y,paddle.w,paddle.h);
}

/* DRAW BALL */
function drawBall(){
  ctx.save();
  ctx.translate(ball.x, ball.y);

  const fontSize = 30;
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.strokeStyle="#fff";
  ctx.lineWidth=2;
  ctx.strokeText(playerName,0,0);

  let fill = (score % 50) / 50;
  let h = fontSize * fill;

  ctx.save();
  ctx.beginPath();
  ctx.rect(-200, fontSize/2-h, 400, h);
  ctx.clip();

  ctx.fillStyle = ball.color;
  ctx.shadowColor = ball.color;
  ctx.shadowBlur = ball.glow;
  ctx.fillText(playerName,0,0);
  ctx.restore();

  ctx.restore();
  ball.glow *= 0.92;
}

/* WAVES */
function drawWaves(){
  waves.forEach((w,i)=>{
    ctx.beginPath();
    ctx.strokeStyle=`rgba(0,234,255,${w.a})`;
    ctx.lineWidth=2;
    ctx.arc(w.x,w.y,w.r,0,Math.PI*2);
    ctx.stroke();
    w.r+=3;
    w.a-=0.03;
    if(w.a<=0) waves.splice(i,1);
  });
}

/* RESET */
function resetBall(){
  ball.x = canvas.width/2;
  ball.y = 120;
  ball.stick = 0;
}

/* GAME LOOP */
function update(){
  if(!game) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);

  if(left) paddle.x -= paddle.speed;
  if(right) paddle.x += paddle.speed;
  paddle.x = Math.max(0, Math.min(canvas.width-paddle.w, paddle.x));

  if(ball.stick>0){
    ball.stick--;
    ball.x += (paddle.x+paddle.w/2-ball.x)*0.08;
    ball.y = paddle.y-22;
  }else{
    ball.x += ball.dx;
    ball.y += ball.dy;
  }

  if(ball.x<40 || ball.x>canvas.width-40) ball.dx*=-1;
  if(ball.y<40) ball.dy*=-1;

  if(ball.y>=paddle.y && ball.x>=paddle.x && ball.x<=paddle.x+paddle.w && ball.dy>0){
    ball.dy*=-1;
    ball.stick=10;
    ball.color=randomColor();
    ball.glow=35;
    shockwave(ball.x,paddle.y);
    score++;
    scoreEl.innerText="Score: "+score;
  }

  if(ball.y>canvas.height){
    lives--;
    livesEl.innerText="❤️ Lives: "+lives;
    if(lives<=0){
      game=false;
      gameOver.style.display="flex";
      setTimeout(()=>location.reload(),1500);
    }else resetBall();
  }

  drawBall();
  drawPaddle();
  drawWaves();
  requestAnimationFrame(update);
}

/* START */
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const gameOver = document.getElementById("gameOver");
update();
