
// Images 
var bgImage;
var playerImage;
var asteroidImage;
var boltImage;
var gameOverImage;
var powerUpImage;
var heartImage;
var bossImage;


// Set the player position
var posX;
var posY;
var playerSpeed = 0.8;
var playerDirection = 0;
var playerDirectionY = 0;
var canvas;
var ctx;
var enemyCount = 30;
var asteroidsX = [];
var asteroidsY = [];
var bolts = [];
var bulletSpeed = 0.3;
var firedX;
// bolt x and y
var inc;
var boltFired = false;

var score = 0;
var lives = 3;
var showGameOver = false;

var oldScore = 0;

var slowdown = 1;
var earnedPowerUp = false;
var usePowerUp = false;
var powerUpTimer;
var speed = 0.2;

var bossTimer = 0;
var bossHealth = 20;
var bossX = 150;
var bossY = -40;
var goingLeft = true;
var inBossFight = false;
var bossFightPreTimer =0;

function SetUpEnemies(number)
{
    for(i = 0; i < enemyCount;i++)
        {
            //asteroidsX[i] = 1000 +Math.random * (1000);
            asteroidsX[i] = Math.random() *(1000 - 0) + 0;
            //asteroidsY[i] = Math.random * (600);
            asteroidsY[i] = Math.random() * (-200-1000) + -200;
        }
}

function Init()
{
    posX = 200;
    posY = 768;
	inc = 0;
    canvas = document.getElementById("game");
    ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 600;
	bossTimer = 0;
    playerImage = new Image();
    playerImage.onload = function () 
    {
    };
        playerImage.src = "images/Spaceship.png";
    asteroidImage = new Image();
    asteroidImage.onload = function () 
    {
    };
        asteroidImage.src = "images/asteroid1.png";
    
    boltImage = new Image();
    boltImage.onload = function () 
    {
    };
        boltImage.src = "images/bolt.png";
		
	gameOverImage = new Image();
    gameOverImage.onload = function () 
    {
    };
        gameOverImage.src = "images/gameover.png";
	powerUpImage = new Image();
	powerUpImage.onload = function () 
    {
    };
        powerUpImage.src = "images/slowdown.png";
	heartImage = new Image();
	heartImage.src ="images/heart.png";
	
	bossImage = new Image();
	bossImage.onload = function()
	{
		
	};
	bossImage.src ="images/boss.png";
    SetUpEnemies(enemyCount);
    
}

function Player()
{
    ctx.restore();
    ctx.drawImage(playerImage,posX,posY);
    //ctx.fillRect(posX,posY,100,20);
    //ctx.fill();
}

function RenderAsteroid()
{
    for(i = 0; i < enemyCount;i++)
    {
        ctx.restore();
        ctx.drawImage(asteroidImage,asteroidsX[i],asteroidsY[i]);
    }
  
    
}
// Add event listeners
var keysdown = {};
addEventListener("keydown",function(e)
{
    if(e.keyCode == 68 && !showGameOver)
    {
        playerDirection = 1;
    }
    if(e.keyCode == 65&& !showGameOver)
    {
        playerDirection = -1;
    }
    if(e.keyCode == 87&& !showGameOver)
    {
        playerDirectionY = -1;
    }
    if(e.keyCode == 83&& !showGameOver)
    {
        playerDirectionY = 1;
    }
	
	if(e.keyCode == 32&& !showGameOver)
	{
		boltFired = true;
		firedX = posX;
	}
	if(e.keyCode == 32&& showGameOver)
	{
		score = 0;
		SetUpEnemies();
		posX = 200;
		posY = 768;
		inc = 0;
		showGameOver = false;
		boltFired = false;
		lives = 3;
		bossX = 150;
		bossY = -40;
		inBossFight = false;
		usePowerUp = false;
		speed = 0.2;
		
	}
	if(e.keyCode == 69&& earnedPowerUp)
	{
		oldScore = score;
		usePowerUp = true;
		earnedPowerUp = false;
		powerUpTimer = 0;
		slowdown = 0.2;
	}
},false);

addEventListener("keyup",function(e)
{
    if(e.keyCode == 68 || e.keyCode == 65)
    {
        playerDirection = 0;
    }
    if(e.keyCode == 87 || e.keyCode == 83)
    {
        playerDirectionY = 0;
    }
},false);

var lastUpdate = Date.now();
var current = setInterval(Tick,16);
function Tick()
{
    var now = Date.now();
    var dt = now - lastUpdate;
    lastUpdate = now;
	//console.log(dt);
    Update(dt);
    Render(dt);
     // Update the player position
    
}



function Update(dt)
{
    // Update the player position
    posX += playerDirection * (playerSpeed  * dt);
	//posX += event.clientX;
    //posY += playerDirectionY * (playerSpeed * dt);
    if(boltFired&& !showGameOver)
	{
		updateBolt(dt);
	}
	if(!showGameOver)
	{
		CollisionDetection();
		
		checkHit();
		checkEnemy();
		if(inBossFight)
		{
			checkBossHit();
			UpdateBoss(dt);
		}
		else
		{
			MoveAsteroid(dt);
		}
		CheckBulletOffScreen();
		score += dt;
		ShowScore();
		CheckLives();
		HasSlowDown();
		ChangeSpeed();
		if(inBossFight)
		{
			HitBoss();
			CheckBossHealth();
		}
		if(usePowerUp)
		{
			powerUpTimer += dt;
			
		}
		//console.log(powerUpTimer);
		if(powerUpTimer > 5000)
		{
			usePowerUp = false;
			earnedPowerUp = false;
			powerUpTimer = 0;
			slowdown = 1;
			
		}
		
	}
	
}

function Render(dt)
{
    ctx.clearRect(0,0,canvas.width,canvas.height);
	if(boltFired)
	{
			renderBolt();
	}
	if(showGameOver)
	{
		ctx.restore();
		ctx.drawImage(gameOverImage,0,0);
	}
	if(usePowerUp && powerUpTimer < 5000)
	{
		ctx.restore();
		ctx.drawImage(powerUpImage,0,0);
	}
    Player();
    
	RenderHearts();
	if(inBossFight)
	{
		if(bossFightPreTimer < 2000)
			bossFightPreTimer+= dt;
		if(bossFightPreTimer >= 2000)
		{
			RenderBoss();
		}	
	}
	else
	{
		RenderAsteroid();
	}
	
	

}

function checkIsFired(){
	
	
}
function RenderBoss()
{
	ctx.restore();
	ctx.drawImage(bossImage,bossX,bossY);
}

function UpdateBoss(dt)
{
	bossTimer += dt;
	//console.log(bossTimer);
	if(bossTimer > 2000 && bossTimer < 3500)
	{
		bossY +=7;
		if(bossY > 230)
		{
			bossY = 230;
		}
	}
	else if(bossTimer > 3500 && bossTimer < 5000)
	{
		bossY -=3;
		if(bossY < -40)
		{
			bossY = -40;
		}
	}
	else if(bossTimer > 6000)
	{
		bossTimer = 0;
	}
	else
	{
		if(goingLeft)
		{
			bossX -= 5;
		}
		if(!goingLeft)
		{
			bossX += 5;
		}
		if(bossX <= -30)
		{
			goingLeft = false;
		}
		if(bossX > 380)
		{
			goingLeft = true;
		}
	}
	
	
}

function RenderHearts()
{
	ctx.restore();
	if(lives == 3)
	{
		ctx.drawImage(heartImage,750,0);
		ctx.drawImage(heartImage,710,0);
		ctx.drawImage(heartImage,670,0);
	}
	else if(lives ==2)
	{
		ctx.drawImage(heartImage,750,0);
		ctx.drawImage(heartImage,710,0);
	}
	else if(lives ==1)
	{
		ctx.drawImage(heartImage,750,0);
	}
    
}
function renderBolt()
{
		ctx.restore();
        ctx.drawImage(boltImage,firedX,posY + inc);
}

function updateBolt(dt)
{
	inc -= playerSpeed * dt;
}

// Collision detection
function CollisionDetection()
{
    if((posX + 100) >= canvas.width )
        posX = canvas.width - 100;
    if(posX <= 0)
        posX = 0;

    if(posY + 32 > canvas.height)
        posY = canvas.height - 32;
    if(posY < 0)
        posY = 0;
}

function MoveAsteroid(dt)
{
    for(i =enemyCount; i >= 0;i--)
    {
        asteroidsY[i] -= ((-speed - score / 10000000)* slowdown * dt);
        if(asteroidsY[i] >1000)
        {
			asteroidsX[i] = Math.random() *(1000 - 0) + 0;
            //asteroidsY[i] = Math.random * (600);
            asteroidsY[i] = Math.random() * (-200-1000) + -200;
            //asteroidsX[i] = Math.random() *(3500 -2000) + 2000;
            //asteroidsY[i] = Math.random * (600);
            //asteroidsY[i] = Math.random() * (800-0) + 0;
        }
    }
}

function checkHit()
{
    for(i = enemyCount; i >= 0; i--)
        {
            if(Math.abs(asteroidsX[i] - posX) < 32 && Math.abs(asteroidsY[i] - posY) < 32)
            {
					lives--;
					asteroidsY[i] = Math.random() * (-200-1000) + -200;
                    console.log("Player Hit");
                    break;
            }
        }
}

function CheckLives()
{
	if(lives == 0)
	{
		showGameOver = true;
	}
}

function ChangeSpeed()
{
	speed += score / 10000000000;
}

function HasSlowDown()
{
	if(score > 2000000)
	{
		inBossFight = true;
	}
	
	if(score > oldScore +1000000)
	{
		console.log("HAVE POWER UP");
		earnedPowerUp = true;
	}
}

function CheckBulletOffScreen()
{
	if((posY + inc) < -20)
	{
		inc = 0;
		boltFired = false;
	}		
}

function checkEnemy()
{
    for(i = enemyCount; i >= 0; i--)
        {
            if(Math.abs(asteroidsX[i] - firedX) < 32 && Math.abs(asteroidsY[i] - (posY + inc)) < 32)
            {
                    //console.log("enemy Hit");
					asteroidsY[i] = Math.random() * (-200-1000) + -200;
					boltFired = false;
					inc =0;
					score += 20000;
                    break;
            }
        }
}

function checkBossHit()
{
	
	if((posX > bossX && posX +32 < bossX + 465) && bossY > 200)
	{
		lives = 0;
	}
}

function HitBoss()
{
	if((firedX > bossX && firedX +32 < bossX + 465) && (posY + inc) <= bossY + 370 )
	{
		console.log("BOSS HIT" + ", BOSS HEALTH: " + bossHealth);
		firedX = 99999;
		bossHealth--;
		//boltFired = false;
		
	}
}
function CheckBossHealth()
{
	if(bossHealth ==0)
	{
		//console.log("BOSS HIT" + ", BOSS HEALTH: " + bossHealth);
		inBossFight = false;
	}
}


function ShowScore()
{
	document.getElementById("score").value = (score / 1000);
}

Init();
