var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombie, zombieImg, zombieGrp;
var heart1,heart2,heart3;
var heart1Img,heart2Img,heart3Img;
var bullets,bulletCount=70, bulletsGrp;
var gameState="play";
var touches=0;
var tomb, tombImg;
var zombieBulletGrp;
var dead, deadImg;
var loseSound, explosionSound, winSound;
var win, winImg;
var score=0;

function preload(){
  
  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")

  bgImg = loadImage("assets/bg.jpeg")
  zombieImg = loadImage('assets/zombie.png');

  heart1Img = loadImage("assets/heart_1.png");
  heart2Img = loadImage("assets/heart_2.png");
  heart3Img = loadImage("assets/heart_3.png");

  tombImg=loadImage("assets/tomb.png");
  deadImg=loadImage('assets/Dead.png');
  winImg=loadImage("assets/Win.png");

  loseSound=loadSound('assets/lose.mp3');
  winSound=loadSound('assets/win.mp3');
  explosionSound=loadSound('assets/explosion.mp3');
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  //adding the background image
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
  bg.addImage(bgImg)
  bg.scale = 1.1;  

  //creating the player sprite
  player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
  player.addImage(shooterImg)
  player.scale = 0.3
  // player.debug = true
  player.setCollider("rectangle",0,0,200,500);

  heart1=createSprite(displayWidth-120,40,20,20);
  heart1.addImage("heart1",heart1Img);
  heart1.scale=0.3;
  heart1.visible=false;


  heart2=createSprite(displayWidth-100,40,20,20);
  heart2.addImage("heart2",heart2Img);
  heart2.scale=0.3;
  heart2.visible=false;


  heart3=createSprite(displayWidth-150,40,20,20);
  heart3.addImage("heart3",heart3Img);
  heart3.scale=0.3;

  tomb=createSprite(displayWidth-1150, displayHeight-300, 50, 50);
  tomb.addImage(tombImg);
  tomb.visible=false;
  tomb.scale=0.2;
  tomb.depth=bg.depth+1;

  dead=createSprite(displayWidth-700,displayHeight-500,50,10);
  dead.addImage(deadImg);
  dead.scale=0.2;
  dead.visible=false;

  win=createSprite(displayWidth-700,displayHeight-500,50,10);
  win.addImage(winImg);
  win.scale=0.2;
  win.visible=false;

  zombieGrp = new Group();
  bulletsGrp = new Group();
  zombieBulletGrp = new Group();
}


function draw() {
  background(0); 

  if(gameState==="play"){
      //moving the player up and down and making the game mobile compatible using touches
    if(keyDown("UP_ARROW")&&player.y>=350||touches.length>0){
      player.y = player.y-30
    }
    if(keyDown("DOWN_ARROW")&&player.y<=displayHeight-250||touches.length>0){
    player.y = player.y+30
    }


    //release bullets and change the image of shooter to shooting position when space is pressed
    if(keyWentDown("space")){
      bullets=createSprite(displayWidth-1150,player.y-30, 15, 5);
      bullets.velocityX=20;
      bulletsGrp.add(bullets);
      bullets.shapeColor='yellow';
      player.depth=bullets.depth;
      player.depth+=2;
      player.addImage(shooter_shooting);
      bulletCount-=1; 
    }

    //player goes back to original standing image once we stop pressing the space bar
    else if(keyWentUp("space")){
      player.addImage(shooterImg)
    }
    // Go to gameState bullet when player runs out of bullets
    if(bulletCount===0){
      gameState="end";
    }

    if(bulletsGrp.isTouching(zombieGrp)){
    for(var i = 0; i < zombieGrp.length; i++){
      if(zombieGrp[i].isTouching(bulletsGrp)){
        zombieGrp[i].destroy();
        bulletsGrp.destroyEach();
      }
    }
    explosionSound.play();
    score++;
    }
    if(zombieBulletGrp.isTouching(player)){
      for(var i = 0; i < zombieBulletGrp.length; i++){
        if(zombieBulletGrp[i].isTouching(player)){
          zombieBulletGrp[i].destroy();
        }
      }
      touches++;
      explosionSound.play();
      if(touches===1){
        heart3.visible=false;
        heart2.visible=true;
      }

      if(touches===2){
        heart2.visible=false;
        heart1.visible=true;
      }
    }
    if(zombieGrp.isTouching(player)){
      for(var i = 0; i < zombieGrp.length; i++){
        if(zombieGrp[i].isTouching(player)){
          zombieGrp[i].destroy();
        }
      }
      touches++;
      explosionSound.play()
      if(touches===1){
        heart3.visible=false;
        heart2.visible=true;
      }

      if(touches===2){
        heart2.visible=false;
        heart1.visible=true;
      }
    }
    if(score===50){
      gameState='win';
    }
    if(touches===3||gameState==='end'){
      tomb.visible=true;
      player.visible=false;
      player.destroy();
      heart1.visible=false;
      zombieGrp.destroyEach();
      zombieGrp.visible=false;
      zombieBulletGrp.destroyEach();
      zombieBulletGrp.visible=false;
      gameState="end";
      dead.visible=true;
      loseSound.play();
    }
    else if(gameState==='win'){
      zombieGrp.destroyEach();
      zombieGrp.visible=false;
      zombieBulletGrp.destroyEach();
      zombieBulletGrp.visible=false;
      win.visible=true;
    }
    spawnZombieRight();
  }

  drawSprites();

  textSize(30);
  fill("white");
  text("score : "+score,displayWidth-300,100);
  text("Bullets Left : "+bulletCount,displayWidth-300,150)
}


function spawnZombieRight(){
  if(frameCount%60===0){
    zombie=createSprite(random(900,1300),random(300,500),100,100);
    zombie.addImage(zombieImg);
    zombie.scale=0.15;
    zombie.velocityX=-2;
    zombie.lifetime=500;
    zombieGrp.add(zombie);
    zombie.setCollider("rectangle",0,0,400,1000);
    // zombie.debug=true;

    zombieBullet=createSprite(zombie.x-5,zombie.y+20,20,5);
    zombieBullet.shapeColor='green';
    zombieBullet.velocityX=-15;
    zombieBullet.lifetime=300;
    zombieBulletGrp.add(zombieBullet);
  }
}
