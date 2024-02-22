let asteroids = [];
let maxAsteroids = 10;

let stars = [];
let maxStars = 1000;
let hyperspaceJump = false;

let eventTimer = 1;
let eventRate = 60;
let eventNum = 10; //around half should be asteroid or other visual spawn.
let eventSelector = 0;

let redAlert = false;
let redAlertSound;
let yellowAlert = false;
let yelAlertSound;
let greenAlert = false;
let greenAletSound;

let lightFlash = false;
let lightTimer = 0;
let winFill = 0;

let ship = 0;
let shipSpawned = false;
let shipImg = 0;

function preload()
{
  redAlertSound = loadSound('assets/redalert.mp3');
}

function setup()
{
  createCanvas(800, 600, WEBGL);
  winFill = color(25, 25, 25);
  createAsteroid(random(-width/2, width/2), random(-height/2, height/2));
  createStarfield();
  eventSelector = int(random(1, eventNum));
  shipImg = loadImage('assets/paintShip.png');
  //redAlertSound.volume(0.5);
}

function createAsteroid(posX, posY)
{
  asteroids.push(new Particle(130, 120, 50, random(width/60, width/8), 0, createVector(posX, posY, random(-1000, -750)), createVector(random(-1, 1), random(-1, 1), random(-1, 1)), createVector(0, 0, 0), 2, 0));
}

function createStarfield()
{
  for (let s = 0; s < maxStars; s++)
  {
    stars.push(new Particle(225, 225, 225, random(1, 6), 30, createVector(random(-width, width), random(-height, height), random(-2000, -500)), createVector(0,0,0.1), createVector(0.05,0.01,0.1), 1, 0));
  }
}

function draw()
{
  if(!hyperspaceJump)
  {background(0);}
  else
  {background(25, 0, 50);}

  for(let s = 0; s < stars.length; s++)
  {
    stars[s].display();

    if (hyperspaceJump)
    {
      stars[s].movement();
      stars[s].changeSpeed();
      stars[s].changeHeight(2);
      stars[s].changeColor(225, 225, 255);

      //spaceFXRotate += spaceFXRotate;
      if (stars[s].isDead())
      {
        stars.splice(s, 1);
      }
    }
  }

  if (stars.length <= 0)
  {
    createStarfield();
    resetEvent();
    hyperspaceJump = false;
    spaceFXRotate = 45;
    asteroids.splice(0, asteroids.length);
    ship = 0;
    shipSpawned = false;
  }
  if (!hyperspaceJump)
  {
    for(let a = 0; a < asteroids.length; a++)
    {
      asteroids[a].display();
      asteroids[a].movement();
      if(asteroids[a].isDead())
      {
        asteroids.splice(a, 1);
      }
    }
    if (shipSpawned)
    {
      ship.display();
      ship.movement();
      if (ship.isDead())
      {
        ship = 0;
        shipSpawned = false;
      }
    }
  }

  //draw "window"
  push();
  shininess(50);
  specularMaterial(220);
  if (redAlert && lightFlash)
  {
    //lights();
    ambientLight(255, 0, 0);
    //spotLight(255, 0, 0, -width/3, -height/3, 5, 0, 0, -1);
    redAlertSound.play();
    //console.log("Red Light Flash");
    //winFill = lerpColor(winFill, color(255, 100, 100), 0.5);
  }
  else if (yellowAlert && lightFlash)
  {
    ambientLight(255, 204, 0);
    //spotLight(255, 0, 0, -width/3, -height/3, 5, 0, 0, -1);
    //winFill = lerpColor(winFill, color(255, 204, 0), 0.5);
  }
  else if (greenAlert && lightFlash)
  {
    ambientLight(0, 255, 0);
    //spotLight(255, 0, 0, -width/3, -height/3, 5, 0, 0, -1);
    //winFill = lerpColor(winFill, color(0, 255, 0), 0.5);
  }
  else
  {
    //noLights();
    redAlertSound.stop();
    //winFill = lerpColor(winFill, color(25, 25, 25), 0.5);
  }
  fill(255, 255, 255, 25);
  translate(0,0,1);
  box(width, height, 5);
  fill(25);
  stroke(255);
  beginShape();
    vertex(-width/2, height/4, 5);
    vertex(-width/2, height/2, 5);
    vertex(0,  height/2, 5);
  endShape(CLOSE);
  beginShape();
    vertex(width/2, height/4, 5);
    vertex(width/2, height/2, 5);
    vertex(0, height/2, 5);
  endShape(CLOSE);
  beginShape();
    vertex(width/2, -height/4, 5);
    vertex(width/2, -height/2, 5);
    vertex(0, -height/2, 5);
  endShape(CLOSE);
  beginShape();
    vertex(-width/2, -height / 4, 5);
    vertex(-width/2, -height/2, 5);
    vertex(0, -height/2, 5);
  endShape(CLOSE);
  pop();

  if ((eventTimer % eventRate) == 0)
  {
    textSize(20);
    eventHandling();
    if (redAlert)
    {
      console.log("Red Alert!");
      //text("Red Alert!", width/2, height/3);
      //text("Click Mouse!", width/2, height/2);
    }
    if (yellowAlert)
    {
      console.log("Yellow Alert!");
      //text("Yellow Alert!", width/2, height/3);
      //text("Press Y!", width/2, height/2);
    }
    if (greenAlert)
    {
      console.log("Green Alert?");
      // text("Green Alert?", width/2, height/3);
      //text("Press G!", width/2, height/2);
    }
  }
  else
  {
    eventTimer++;
  }
}

function asteroidSpawner()
{
  if(asteroids.length < maxAsteroids)
  {createAsteroid(random(width - 50), random(height - 50));}
}

function shipSpawner()
{
  //ship = new Particle(125, 125, 125, 50, 0, createVector(random(width), random(height), -10), createVector(2*random(-1, 1), 2*random(-1, 1), 2*(random(-1,1))), createVector(0, 0, 0), 3, shipImg);
  //shipSpawned = true;
  //console.log("Ship Should appear");
}

function eventHandling()
{
  switch (eventSelector)
  {
    case 1:
    case 2:
      if (!shipSpawned)
      {
      shipSpawner();
      }
      resetEvent();
      break;
    case 3:
      //hyperspaceJump = true;
      //break;
    case 4:
    case 5:
    case 6:
      asteroidSpawner();
      resetEvent();
      break;
    case 7:
      lightTimer++;
      greenAlert = true;
      if (lightTimer >= 30)
      { 
        lightTimer = 0;
        lightFlash = !lightFlash;
      }
      break;
    case 8:
      lightTimer++;
      redAlert = true;
      if (lightTimer >= 30)
      { 
        lightTimer = 0;
        lightFlash = !lightFlash;
      }
      break;
    case 9:
      lightTimer++;
      yellowAlert = true;
      if (lightTimer >= 30)
      { 
        lightTimer = 0;
        lightFlash = !lightFlash;
      }
      break;
    default:
      resetEvent();
      break;
  }
}

function keyReleased()
{
  if ((key == 'y' || key == 'Y') && yellowAlert)
  {
    resetEvent();
  }
  else if ((key == 'g' || key == 'G') && greenAlert)
  {
    resetEvent();
  }
}

function mouseClicked()
{
  if ((eventTimer % eventRate) == 0 && redAlert)
  {
    resetEvent();
  }
}

function resetEvent()
{
  eventTimer = 1;
  eventSelector = int(random(eventNum));
  lightTimer = 0;
  redAlert = false;
  yellowAlert = false;
  greenAlert = false;
  lightFlash = false;
}

class Particle
{
  constructor(pRed, pGreen, pBlue, pSize, pAngle, pPos, pVelo, pAccel, pShape, pImage)
  {
    this.pWidth = pSize;
    this.pHeight = pSize;
    this.pDepth = pSize;
    this.position = pPos;
    this.speed = pVelo;
    this.acceleration = pAccel;
    this.pRed = pRed;
    this.pGreen = pGreen;
    this.pBlue = pBlue;
    this.angle = pAngle;
    this.shape = pShape; //an int representing how to display it. 1 for rect, 2 for ellipse, 3 for an image.
    this.pImage = pImage;
    /*if (this.shape == 3)
    {
      console.log("A ship was created!");
    }*/
  }

  display()
  {
    noStroke();
    fill(this.pRed, this.pGreen, this.pBlue);
    if (this.shape == 1)
    {
      push();
      translate(this.position.x, this.position.y, this.position.z);
      rotate(radians(random(360)));
      box(this.pWidth, this.pHeight, this.pDepth);
      pop();
    }
    else if (this.shape == 2)
    {
      push();
      translate(this.position.x, this.position.y, this.position.z);
      rotate(radians(random(360)));
      sphere(this.pDepth);
      pop();
    }
    else if (this.shape == 3)
    {
      push();
      angleMode(DEGREES);
      imageMode(CENTER);
      translate(this.position.x, this.position.y)
      rotate(this.speed.heading() + 90);
      //console.log(this.speed.heading());
      image(this.pImage, 0, 0, this.pWidth, this.pHeight);
      pop();
    }
  }

  changeColor(newRed, newGreen, newBlue)
  {
    this.pRed = lerp(this.pRed, newRed, 0.5);
    this.pGreen = lerp(this.pGreen, newGreen, 0.5);
    this.pBlue = lerp(this.pBlue, newBlue, 0.5);
  }

  changeHeight(newSize)
  {
    this.pHeight = lerp(this.pHeight, this.pHeight + newSize, 0.5);
    //this.pWidth = lerp(this.pWidth, this.pWidth + newSize, 0.5);
    //this.pDepth = lerp(this.pDepth, this.pDepth + newSize, 0.5);
  }

  changeSpeed()
  {
    this.speed.add(this.acceleration);
  }

  isDead()
  {
    if (this.position.x > width + 25 || this.position.x < -width - 25|| this.position.y > height + 25|| this.position.y < -height -25 || this.position.z < -2000 || this.position.z > 0)
    {
      console.log("Asteroid was at: " + this.position.x + " depth");
      return true;
    }
    return false;
  }

  movement()
  {
    this.position.add(this.speed);
  }
}