var numbers = [22,9,10,7,15,80,40]

var PLAY = 1;
var END = 0;
var gameState = PLAY;

function numcall(){
  sum = 0;
  for(var n = 0; n < numbers.length;n++){
    sum = sum+numbers[n];
  }
  var avg = sum/numbers.length;
  
}

var trex ,trex_running;
var trexCollided;
var restarting, gameOvering;
function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trexCollided = loadAnimation("trex_collided.png");
  
  groundimage = loadImage("ground2.png");
  
  cloudImg = loadImage("cloud.png");

  cactus1 = loadImage("obstacle1.png");
  cactus2 = loadImage("obstacle2.png");
  cactus3 = loadImage("obstacle3.png");
  cactus4 = loadImage("obstacle4.png");
  cactus5 = loadImage("obstacle5.png");
  cactus6 = loadImage("obstacle6.png");

  restarting = loadImage("restart.png");
  gameOvering = loadImage("gameOver.png");

  jumpSound = loadSound("jump.mp3");
  checkpointSound = loadSound("checkpoint.mp3");
  dieSound = loadSound("die.mp3");
  
}

function setup(){
  createCanvas(windowWidth,windowHeight);

  rand = Math.round(random(0,150))

  score = 0;

  
  
  trex = createSprite(50,height-170,20,60);
  trex.addAnimation("player",trex_running);
  trex.addAnimation("collided",trexCollided);
  trex.scale = 0.5;
  trex.debug = false;
  trex.setCollider("rectangle",0,0,60,80);

  gameOver = createSprite(width/2,height/2-50,10,10);
  gameOver.addImage(gameOvering);

  restart = createSprite(width/2,height/2+20,10,10);
  restart.addImage(restarting);
  restart.scale = 0.5;
  
  ground = createSprite(width/2,height-160,1200,10)
  ground.addImage(groundimage);
  edges = createEdgeSprites();
  
  invisibleground = createSprite(300,height-150,1200,10);
  invisibleground.visible = false;

  cactiGroup = new Group();
  cloudsGroup = new Group();

  numcall();
  


}

function draw(){
  background("lightgrey");
  drawSprites();
  
  text ("Score: " + score,50,50);
  
  console.log(getFrameRate());

  if(gameState === PLAY){
    
    if(touches.length>0 || keyDown("space") && trex.y >= height-180){
      trex.velocityY = -15;
      jumpSound.play();
      touches = []
    }
    trex.velocityY += 1;
    score = Math.round(score+getFrameRate()/60);
  
    ground.velocityX = -(3+score/100);

    if(ground.x < 350){
      ground.x = ground.width/2;
    }

    clouds();
    cacti();

    if(cactiGroup.isTouching(trex)){
      gameState = END;
      dieSound.play();
      //trex.velocityY= -15;
      //jumpSound.play();
    }

    if(score%500 == 0 && score > 0){
      checkpointSound.play();
    }

    gameOver.visible = false;
    restart.visible = false;
  }
  else if(gameState === END){
    cactiGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    ground.velocityX = 0;
    trex.changeAnimation("collided");
    cactiGroup.setLifetimeEach(-7);
    cloudsGroup.setLifetimeEach(-7);
    gameOver.visible = true;
    restart.visible = true;

    if(mousePressedOver(restart) || touches.length>0){
      gameState = PLAY;

      cactiGroup.destroyEach();
      cloudsGroup.destroyEach();

      score = 0;

      trex.changeAnimation("player");

      touches=[];
    }
  }
  
  trex.collide(invisibleground);
}


function clouds(){
  if(frameCount % 70 === 0){

    cloud = createSprite(width,Math.round(random(20,150)),70,10);
    cloud.addImage(cloudImg);
    cloud.velocityX = -3;
    cloud.scale = 0.75;
    trex.depth = cloud.depth;
    trex.depth +=1;
    cloud.lifetime = width/clouds.velocityX;
    cloudsGroup.add(cloud);
  }
}

function cacti(){
  if(frameCount % 85 === 0){
    cactus = createSprite(width,height-175,10,40)
    cactus.velocityX = -(3+score/100);
    num = Math.round(random(1,6));

    switch(num){
      case 1: cactus.addImage(cactus1);
      break
      case 2:cactus.addImage(cactus2);
      break
      case 3: cactus.addImage(cactus3);
      break
      case 4:cactus.addImage(cactus4);
      break
      case 5:cactus.addImage(cactus5);
      break
      case 6:cactus.addImage(cactus6);
      break
      default: break
    }

    cactus.scale = 0.5
    cactiGroup.add(cactus);
    cactus.lifetime = width/cactus.velocityX;
  }

  
  
}