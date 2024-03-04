function detectMax() {
  try {
    /*
      For references to all functions attached to window.max object read the
      "Communicating with Max from within jweb" document from Max documentation.
    */
    window.max.outlet('Hello', 0);
    return true;
  }
  catch(e) {
    console.log('Max, where are you?');
  }
  return false;
}

let s = function(p) {

  // let's test and memorize if the sketch is loaded inside Max jweb object
  const maxIsDetected = detectMax();

  /*
    Use windowResized function to adopt canvas size to the current size of
    the browser. It is particularly important when sketch is loaded inside
    the Max jweb object, which may be dynamically resized by the user.
  */
  p.windowResized = function() {
    p.resizeCanvas(innerWidth, innerHeight);
  }


let asteroids = [];
let maxAsteroids = 10;
let asTexture;
let plTexture;

let stars = [];
let maxStars = 1000;
let hyperspaceJump = false;
let hsRed = 255;
let hsGreen = 255;
let hsBlue = 255;
let hsCount = 0;

let eventTimer = 1;
let eventRate = 60;
let eventNum = 50; //around half should be asteroid or other visual spawn.
let eventSelector = 0;

let redAlert = false;
//let redAlertSound;
let yellowAlert = false;
//let yelAlertSound;
let greenAlert = false;
//let greenAletSound;

let lightFlash = false;
let lightTimer = 0;
//let winFill = 0;

let ship = [];
let shipMod2;
let shipMod;

p.preload = function ()
{
  //redAlertSound = p.loadSound('assets/redalert.mp3');
  shipMod = p.loadModel('assets/shipTest.obj', p.true);
  shipMod2 = p.loadModel('assets/newscene.obj', p.true);
}

p.setup = function()
{
  p.createCanvas(innerWidth, innerHeight, p.WEBGL);
  if(maxIsDetected) {
    // remove unwanted scroll bar
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
  }
  p.perspective();
  winFill = p.color(25, 25, 25);
  p.createAsteroid(p.random(-p.width/2, p.width/2), p.random(-p.height/2, p.height/2));
  p.createStarfield();
  eventSelector = p.int(p.random(1, eventNum));
  asTexture = p.loadImage('assets/asteroidTexture.png');
  plTexture = p.loadImage('assets/planetTexture.png');
}

p.createPlanet = function (posX, posY)
{
  asteroids.push(new Particle(130, 120, 50, p.random(p.width/100, p.width/8), 0, p.createVector(posX, posY, p.random(-1000, -750)), p.createVector(p.random(-0.1, 0.1), p.random(-0.1, 0.1), p.random(-0.1, 0.1)), p.createVector(0, 0, 0), 2, 2));
}

p.createAsteroid = function (posX, posY)
{
  asteroids.push(new Particle(130, 120, 50, p.random(p.width/60, p.width/8), 0, p.createVector(posX, posY, p.random(-1000, -750)), p.createVector(p.random(-1, 1), p.random(-1, 1), p.random(-1, 1)), p.createVector(0, 0, 0), 2, 1));
}

p.createStarfield = function ()
{
  for (let s = 0; s < maxStars; s++)
  {
    stars.push(new Particle(190 + p.random(60), 190 + p.random(60), 190 + p.random(60), p.random(1, 6), 30, p.createVector(p.random(-p.width*1.5, p.width*1.5), p.random(-p.height * 1.5, p.height * 1.5), p.random(-2000, -1000)), p.createVector(0,0,0.1), p.createVector(0.05,0.01,0.1), 1, 0));
  }
}

p.draw = function()
{
  if(!hyperspaceJump)
  {p.background(0);}
  else
  {p.background(25, 0, 50);}

  for(let s = 0; s < stars.length; s++)
  {
    stars[s].display();

    if (hyperspaceJump)
    {
      //stars[s].movement();
      //stars[s].changeSpeed();
      stars[s].changeDepth(8);

       stars[s].changeColor(hsRed, hsGreen, hsBlue);
       
      //spaceFXRotate += spaceFXRotate;
      if (stars[s].pDepth > 2 * p.height)
      {
        stars.splice(s, 1);
      }
      if ((hsCount % 1000) == 0)
      {
        //console.log(hsCount%1000);
        hsRed = p.int(p.random(0, 255));
        hsGreen = p.int(p.random(0, 255));
        hsBlue = p.int(p.random(0, 255));
        hsCount = 0;
      }
      else
      {
        hsCount++;
      }
    }
  }

  if (stars.length <= 0)
  {
    //turn off jump sound.
    p.createStarfield();
    p.resetEvent();
    hyperspaceJump = false;
    spaceFXRotate = 45;
    asteroids.splice(0, asteroids.length);
    ship.splice(0, ship.length);
    hsBlue = 255;
    hsGreen = 255;
    hsRed = 255;
    hsCount = 0;
  }
  if (!hyperspaceJump)
  {
    for(let a = 0; a < asteroids.length; a++)
    {
      asteroids[a].display();
      asteroids[a].movement();
      asteroids[a].changeSize(asteroids[a].speed.z)
      asteroids[a].moveUp();
      if(asteroids[a].isDead())
      {
        asteroids.splice(a, 1);
      }
    }
    if (ship.length > 0)
    {
      for (let a = 0; a < ship.length; a++)
      {
        ship[a].display();
        ship[a].movement();
        ship[a].changeSpeed();
        //make a random number to see if the ship jumps early
        if (ship[a].isDead())
        { //code to make a flas hbefore the ship disapears
          //console.log("Ship Out of Bounds");
          ship.splice(a, 1);
        }
      }
    }
  }

  //draw "window"
  p.push();
  p.shininess(50);
  p.specularMaterial(220);
  if (redAlert && lightFlash)
  {
    //lights();
    p.ambientLight(255, 0, 0);
    //spotLight(255, 0, 0, -width/3, -height/3, 5, 0, 0, -1);
    //redAlertSound.play();
    //console.log("Red Light Flash");
    //winFill = lerpColor(winFill, color(255, 100, 100), 0.5);
  }
  else if (yellowAlert && lightFlash)
  {
    p.ambientLight(255, 204, 0);
    //spotLight(255, 0, 0, -width/3, -height/3, 5, 0, 0, -1);
    //winFill = lerpColor(winFill, color(255, 204, 0), 0.5);
  }
  else if (greenAlert && lightFlash)
  {
    p.ambientLight(0, 255, 0);
    //spotLight(255, 0, 0, -width/3, -height/3, 5, 0, 0, -1);
    //winFill = lerpColor(winFill, color(0, 255, 0), 0.5);
  }
  else
  {
    //noLights();
    //redAlertSound.stop();
    //winFill = lerpColor(winFill, color(25, 25, 25), 0.5);
  }
  p.fill(255, 255, 255, 25);
  p.translate(0,0,1);
  //box(width, height, 5);
  p.fill(155, 155, 155, 255);
  p.stroke(255);
  p.beginShape();
  p.vertex(p.width/2, -p.height/4, 5);
  p.vertex(p.width/2, -p.height/2, 5);
  p.vertex(0, -p.height/2, 5);
  p.endShape(p.CLOSE);
  p.beginShape();
  p.vertex(-p.width/2, -p.height / 4, 5);
  p.vertex(-p.width/2, -p.height/2, 5);
  p.vertex(0, -p.height/2, 5);
  p.endShape(p.CLOSE);
  p.noLights();
  p.ambientLight(0,0,0);
  p.beginShape();
  p.vertex(-p.width/2, p.height/4, 5);
  p.vertex(-p.width/2, p.height/2, 5);
  p.vertex(0,  p.height/2, 5);
  p.endShape(p.CLOSE);
  p.beginShape();
  p.vertex(p.width/2, p.height/4, 5);
  p.vertex(p.width/2, p.height/2, 5);
  p.vertex(0, p.height/2, 5);
  p.endShape(p.CLOSE);
  p.pop();

  if ((eventTimer % eventRate) == 0)
  {
    p.textSize(20);
    p.eventHandling();
    if (redAlert)
    {
      console.log("Red Alert!");

    }
    if (yellowAlert)
    {
      console.log("Yellow Alert!");

    }
    if (greenAlert)
    {
      console.log("Green Alert?");

    }
  }
  else
  {
    eventTimer++;
  }
}

p.asteroidSpawner = function()
{
  if(asteroids.length < maxAsteroids)
  {p.createAsteroid(p.random(p.width - 50), p.random(p.height - 50));}
}

p.shipSpawner = function(shModel)
{
  //ship.push(new Particle(p.random(255), p.random(255), p.random(255), 0, 0, p.createVector(0, 0, p.random(-1000, -300)), p.createVector(p.random(-1, 1), p.random(-1, 1), p.random(-1, 1)), p.createVector(0, 0, 0), 3, shModel));
  ship.push(new Particle(p.random(255), p.random(255), p.random(255), 0, 0, p.createVector(p.random(-0.75*p.width, 0.75*p.width), p.random(-0.75*p.height, 0.75*p.height), p.random(-1000, -300)), p.createVector(p.random(-1, 1), p.random(-1, 1), p.random(-1, 1)), p.createVector(p.random(-1, 1), p.random(-1, 1), p.random(-1, 1)), 3, shModel));
  //console.log("Ship Should appear");
}

p.eventHandling = function ()
{
  switch (eventSelector)
  {
    case 5:
      //p.shipSpawner(); make a space station model
      p.resetEvent();
      break;
    case 6:
      p.shipSpawner(shipMod2);
      p.resetEvent();
      break;
    case 7:
      p.shipSpawner(shipMod);
      p.resetEvent();
      break;
    case 8:
      hyperspaceJump = true;
      //insert call for hyperspace jump sound and an initial volume
      break;
    case 12:
    case 13:
    case 14:
    case 15:
    case 16:
      p.asteroidSpawner();
      p.resetEvent();
      break;
    case 17:
      //give an announcment or message, then tur off.
      lightTimer++;
      if (maxIsDetected && !greenAlert)
      {window.max.outlet('Alert', 'Green', 65);}
      greenAlert = true;
  
      if (lightTimer >= 30)
      { 
        lightTimer = 0;
        lightFlash = !lightFlash;
      }
      break;
    case 18:
      //add a major error and instructins on how to fix it.
      lightTimer++;
      if (maxIsDetected && !redAlert)
      {window.max.outlet('Alert', 'Red', 100);}
      redAlert = true;

      if (lightTimer >= 30)
      { 
        lightTimer = 0;
        lightFlash = !lightFlash;
      }
      break;
    case 19:
      //add a minor error and instrctions on how to fix it.
      lightTimer++;
      if (maxIsDetected && !yellowAlert)
      {window.max.outlet('Alert', 'Yellow', 80);}
      yellowAlert = true;

      if (lightTimer >= 30)
      { 
        lightTimer = 0;
        lightFlash = !lightFlash;
      }
      break;
    case 20:
      //Play a random ambient noise
      p.resetEvent();
      break;
    case 21:
      p.createPlanet();
      p.resetEvent();
      break;
    default:
      p.resetEvent();
      break;
  }
}

p.keyReleased = function()
{
  if ((p.key == 'y' || p.key == 'Y') && yellowAlert)
  {
    if (maxIsDetected)
    {window.max.outlet('Alert', 'none', 0);}
    p.resetEvent();
  }
  else if ((p.key == 'g' || p.key == 'G') && greenAlert)
  {
    if (maxIsDetected)
    {window.max.outlet('Alert', 'none', 0);}
    p.resetEvent();
  }
  else if ((p.key == 's' || p.key == 'S'))
  {
    eventSelector = 7;
  }
  else if ((p.key == 'd' || p.key == 'D'))
  {
    eventSelector = 6;
  }
  else if ((p.key == 'a' || p.key == 'A'))
  {
    eventSelector = 15;
  }
  else if (p.key == 'j' || p.key == 'J')
  {
    eventSelector = 8;
  }
  else if (p.key == 'p' || p.key == 'P')
  {
    eventSelector = 21;
  }
}

p.mouseClicked = function ()
{
  if ((eventTimer % eventRate) == 0 && redAlert)
  {
    if (maxIsDetected)
    {window.max.outlet('Alert', 'none', 0);}
    p.resetEvent();
  }
}

p.resetEvent = function ()
{
  eventTimer = 1;
  eventSelector = p.int(p.random(eventNum));
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
    this.acceleration = pAccel.mult(p.random(-0.1, 0.75));
    this.pRed = pRed;
    this.pGreen = pGreen;
    this.pBlue = pBlue;
    this.angle = pAngle;
    this.shape = pShape; //an int representing how to display it. 1 for rect, 2 for ellipse, 3 for an image.
    this.pImage = pImage;
    this.rotVal = p.random(-2, 2);
    this.rotChange = p.random(-0.1, 0.5);
    /*if (this.shape == 3)
    {
      console.log("A ship was created!");
    }*/
  }

  display()
  {
    p.noStroke();
    p.fill(this.pRed, this.pGreen, this.pBlue);
    if (this.shape == 1)
    {
      p.push();
      p.translate(this.position.x, this.position.y, this.position.z);
      p.box(this.pWidth, this.pHeight, this.pDepth);
      p.pop();
    }
    else if (this.shape == 2)
    {
      p.push();
      p.translate(this.position.x, this.position.y, this.position.z);
      p.rotate(p.radians(this.rotVal * p.PI));
      if (this.pImage == 1)
      {p.texture(asTexture);}
      else if (this.pImage == 2)
      {
        p.texture(plTexture);
      }
      p.sphere(this.pDepth, 24, 24);
      p.pop();
    }
    else if (this.shape == 3)
    {
      p.push();
      p.lights();
      p.ambientLight(155, 155, 155);
      p.translate(this.position.x, this.position.y, this.position.z);
      //p.rotateX();
      p.rotate(this.speed.heading());
      //p.rotateZ(90);
      p.model(this.pImage);
      p.pop();
    }
    this.rotVal += this.rotChange;
  }

  changeColor(newRed, newGreen, newBlue)
  {
    this.pRed = p.lerp(this.pRed, newRed, 0.5);
    this.pGreen = p.lerp(this.pGreen, newGreen, 0.5);
    this.pBlue = p.lerp(this.pBlue, newBlue, 0.5);
  }

  changeSize(newSize)
  {
    this.changeHeight(newSize);
    this.changeWidth(newSize);
    this.changeDepth(newSize);
  }

  changeHeight(newSize)
  {
    this.pHeight = p.lerp(this.pHeight, this.pHeight + newSize, 0.5);
  }

  changeWidth(newSize)
  {
    this.pWidth = p.lerp(this.pWidth, this.pWidth + newSize, 0.5);
  }

  changeDepth(newSize)
  {
    this.pDepth = p.lerp(this.pDepth, this.pDepth + newSize, 0.5);
  }

  changeSpeed()
  {
    this.speed.add(this.acceleration);
  }
  
  moveUp()
  {
    if (this.speed.z != 0)
    {
      this.speed.add(p.createVector(0,this.speed.z/10,0));
    }
  }

  isDead()
  {
    if (this.position.x > p.width + 100 || this.position.x < -p.width - 100|| this.position.y > p.height + 100|| this.position.y < -p.height -100 || this.position.z < -999 || this.position.z > -1-this.pDepth)
    {
      //console.log("Asteroid was at: " + this.position.x + " depth");
      return true;
    }
    return false;
  }

  movement()
  {
    this.position.add(this.speed);
  }
}


}

let myp5 = new p5(s);