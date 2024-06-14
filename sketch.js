var cloudsGroup,obstaclesGroup;
var trex ,trex_running,trex_collided;
var groundImage,ground;
var cloud,cloudImage;
var obstacles,obstacleImage1,obstacleImage2,obstacleImage3,obstacleImage4,obstacleImage5,obstacleImage6;
var points=0;
var PLAY=1;
var END=0;
var gameState=PLAY;
var gameover,gameoverImage;
var restart,restartImage;
var jumpSound,diedSound,pointsSound;

function preload(){
  trex_running=loadAnimation("trex1.png","trex3.png","trex4.png");
  groundImage=loadImage("ground2.png");
  cloudImage=loadImage("cloud.png");
  obstacleImage1=loadImage("obstacle1.png");
  obstacleImage2=loadImage("obstacle2.png");
  obstacleImage3=loadImage("obstacle3.png");
  obstacleImage4=loadImage("obstacle4.png");
  obstacleImage5=loadImage("obstacle5.png");
  obstacleImage6=loadImage("obstacle6.png");
  trex_collided=loadAnimation("trex_collided.png");
  gameoverImage=loadImage("gameOver.png");
  restartImage=loadImage("restart.png");
  jumpSound=loadSound("jump.mp3");
  diedSound=loadSound("die.mp3");
  pointsSound=loadSound("checkpoint.mp3")
}

function setup(){
  createCanvas(600,200)
  
  //crear sprite del t-rex.
  edges = createEdgeSprites();

 trex=createSprite(50,160,50,50);
 trex.addAnimation("running",trex_running);
 trex.addAnimation("collided",trex_collided);
 trex.scale=0.75;
 trex.x=50;

 ground=createSprite(200,180,400,20);
 ground.addImage("ground",groundImage);
 ground.x=ground.width / 2;

 invisibleGround=createSprite(200,190,400,20);
 invisibleGround.visible=0;

 obstaclesGroup=new Group();

 cloudsGroup=new Group();

gameover=createSprite(300,75,100,100);
gameover.addImage("GAMEOVER",gameoverImage);
gameover.visible=false;

restart=createSprite(300,125,50,50);
restart.addImage("RESTART",restartImage);
restart.scale=0.5;
restart.visible=false;

}

function draw(){
  background("white")
  //console.log(ground.x);
   //console.log(frameCount);
   text("Points:"+points,500,60);
   trex.collide(invisibleGround);
   //trex.setCollider("circle",0,0,40);
   //trex.debug=true;
   if(gameState===PLAY){
    ground.velocityX=-10;

    points=points+Math.round(frameCount%2===0);
    if(ground.x < 0){
      ground.x = ground.width / 2;
    }

    if (keyDown("space") && trex.y>=145) {
      trex.velocityY = -10;
      jumpSound.play();
     }

     if(points>0 && points%100 === 0){
      pointsSound.play();
      ground.velocityX= ground.velocityX - 1;
      
     }
    trex.velocityY = trex.velocityY + 0.5;

    spawnClouds();

    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)){
      gameState=END;
      diedSound.play();
    }
   }else if (gameState===END) {
    ground.velocityX=0;

    trex.changeAnimation("collided",trex_collided);
    trex.velocityY = trex.velocityY + 0.5;

    obstaclesGroup.setLifetimeEach(-1)
    cloudsGroup.setLifetimeEach(-1)

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    gameover.visible=true;
    restart.visible=true;

    if(mousePressedOver(restart)){
      restartGame();
    }
   }
  drawSprites();
}
function spawnClouds(){
  if(frameCount%60 === 0 ){
    cloud=createSprite(600,60,25,25);
    cloud.addImage("cloud",cloudImage);
    cloud.velocityX=-3;
    cloud.scale=0.4;
    cloud.y=Math.round(random(10,60));
    cloud.depth=trex.depth;
    trex.depth=trex.depth+1;
    cloud.lifetime=200;
    cloudsGroup.add(cloud);
    // console.log(cloud.depth);
    //console.log(trex.depth)
  }
}
function spawnObstacles(){
 if(frameCount%60 === 0){
  obstacle=createSprite(600,160,10,40);
  obstacle.velocityX=-(5+points/100);
  var ramd=Math.round(random(1,6));
  switch(ramd){
    case 1:obstacle.addImage(obstacleImage1);
      break;
    case 2:obstacle.addImage(obstacleImage2);
      break;
    case 3:obstacle.addImage(obstacleImage3)
      break;
    case 4:obstacle.addImage(obstacleImage4);
      break;
    case 5:obstacle.addImage(obstacleImage5);
      break;
    case 6:obstacle.addImage(obstacleImage6);
      break;
    default: break;
  }
  obstacle.scale=0.5;
  obstacle.lifetime=130;
  obstaclesGroup.add(obstacle);
 }
}
function restartGame(){
  points= 0;
  trex.changeAnimation("running",trex_running);
  gameover.visible=false;
  restart.visible=false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  gameState= PLAY;
}