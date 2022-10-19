//this is the code for a generative wallpaper inspired by japanese prints of Mt. Fuji

let raindrops = []; // I create an array to contain all the raindrops
let snowflakes = []; // the same for the snowflakes
let clouds = []; // and for the clouds
let c1, c2; // variables for the background colors
let night = false; // variable to control the background color change
let counter = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 300; i++) {
    raindrops.push(new Raindrop(width / 2, -10));
  } // I create 300 raindrops using the "Raindrop" class

  for (let i = 0; i < 10; i++) {
    clouds.push(new Cloud(random(0, width), random(0, height), 1));
  } // I create 10 clouds using the "Cloud" class
}

function draw() {
  background(0);
  let test1 = 540 + 2160 * counter;
  let test2 = 1620 + 2160 * counter;
  // the background assume day colors as default, but when the sun goes down it switch to night colors

  if (frameCount % test1 == 0) {
    night = true;
  }

  if (frameCount % test2 == 0) {
    night = false;
  }

  if (frameCount % 2160 == 0) {
    counter++;
  }

  if (night == false) {
    c1 = color(255);
    c2 = color(63, 191, 191);
  } else if (night == true) {
    c1 = color(255);
    c2 = color("#1c2242");
  }

  //alternative code to make the background switch when the mouseX goes over the half of the width
  /*if (mouseX > width / 2) {
    c2 = color("#1c2242");
  } else {
    c2 = color(63, 191, 191);
  }*/

  for (let y = 0; y < height; y++) {
    n = map(y, 0, height, 0, 1); // variable to control the lerp
    let newc = lerpColor(c1, c2, n);
    stroke(newc);
    line(0, y, width, y); // lerp allows me to create many gradient lines to cover all the background, creating an entire gradient bg
  }

  noStroke();
  push();
  angleMode(DEGREES);
  fill("#ba4347");
  translate(width / 2, height); //I move the center to the center-bottom to obtain the rotation I wanted for Sun and Moon
  rotate(frameCount / 6); // slow rotation based on the framecount
  ellipse(0, -height / 2, 400, 400); //sun
  fill("#eccab1");
  ellipse(0, height / 2, 400, 400); //moon
  pop();

  fill("#754e3f");
  triangle(
    (2 * width) / 8,
    height,
    (6 * width) / 8,
    height,
    (4 * width) / 8,
    height - 500
  );
  fill("white");
  triangle(
    (3 * width) / 8 - width / 300,
    height - height / 4,
    (5 * width) / 8 + width / 300,
    height - height / 4,
    (4 * width) / 8,
    height - 500
  ); //Mt. Fuji

  //for cycle to add the raindrops to canvas and make them move
  for (let i = 0; i < raindrops.length; i++) {
    raindrops[i].adddrop();
    raindrops[i].fall();
  }

  //for cycle to add the snowflakes to canvas and make them move
  for (let i = 0; i < snowflakes.length; i++) {
    snowflakes[i].addflake();
    snowflakes[i].fall();
  }

  //for cycle to add the clouds to canvas and make them move
  for (let i = 0; i < clouds.length; i++) {
    clouds[i].addcloud();
    clouds[i].move();
  }

  // now I create the text instructions for the user

  fill("#ba4347");
  rectMode(CENTER);
  rect(width / 2, height / 4 - 20, 200, 70);
  rect((4 * width) / 5, (2 * height) / 5, 400, 60);
  rect(width / 5, (2 * height) / 5, 400, 60);
  fill("white");
  textSize(22);
  textFont("Noto Sans");
  textAlign(CENTER);
  text(
    "Mouse click to create snowflakes",
    width / 5,
    (2 * height) / 5 + height / 110
  );
  text(
    "Mouse move to control the storm",
    (4 * width) / 5,
    (2 * height) / 5 + height / 110
  );
  textFont("Noto Sans Japanese");
  textAlign(CENTER);
  textSize(60);
  text("富士山", width / 2, height / 4); // "Mt. Fuji" in japanese, just because the wallpaper is inspired by it
}

//class for the raindrops
class Raindrop {
  constructor(xpos, ypos) {
    this.x = xpos * random(-1, 1);
    this.y = ypos * random(-100, 100);
    this.color = "#507494";
  }

  adddrop() {
    let x = width / 2;
    let y = random(-10, 10);
    let z = random(0, 20); // i add a 3rd variable to simulate distance from viewer, so that drops with low z will be shorter and so look more distant
    let len = map(z, 0, 20, 10, 50); //raindrops will have different lenght based on the z distance from viewer (the furthest, the shorter)
    let thickness = map(z, 0, 20, 1, 3); //same thing for the thickness
    push();
    translate(this.x, this.y);
    noFill();
    strokeWeight(thickness);
    stroke(this.color);
    line(x, y, x, y + len);
    pop();
  }

  fall() {
    let ySpeed = map(mouseX, 0, width, 10, 100); // the raindrops' speed is based on the mouseX position, so that on the right side of the screen you'll have a stronger storm effect
    this.x += random(-1, 1); // just a little variation also on the x to emulate wind effect on the drops
    this.y = this.y + ySpeed;

    if (this.y > height) {
      this.y = random(-100, 0); // when they exit from view, they return back to the top
    }
  }
}

//class for the snowflakes
class Snowflake {
  constructor(sxpos, sypos) {
    this.sx = sxpos;
    this.sy = sypos;
    this.color = "white";
  }

  addflake() {
    //let x = width / 2;
    //let y = random(-10, 10);
    push();
    //translate(this.sx, this.sy);
    fill(this.color);
    ellipse(this.sx, this.sy, 10, 10);
    pop();
  }

  fall() {
    let sySpeed = map(mouseX, 0, width, 1, 10);
    this.sx += random(-1, 1);
    this.sy = this.sy + sySpeed;
  }
}

//class for the clouds
class Cloud {
  constructor(cxpos, cypos, cs) {
    this.cx = cxpos;
    this.cy = cypos;
    this.cs = cs * random(40, 80); //variable to change the clouds size randomly
    this.color = "white";
  }

  addcloud() {
    push();
    fill("white");
    ellipse(this.cx, this.cy, this.cs, this.cs);
    ellipse(this.cx + (2 / 3) * this.cs, this.cy + 10, this.cs, this.cs);
    ellipse(this.cx + (2 / 3) * this.cs, this.cy - 10, this.cs, this.cs);
    ellipse(this.cx + (2 / 3) * this.cs * 2, this.cy, this.cs, this.cs);
    ellipse(this.cx + (2 / 3) * this.cs * 2, this.cy - 20, this.cs, this.cs);
    ellipse(this.cx + (2 / 3) * this.cs * 2, this.cy + 20, this.cs, this.cs);
    ellipse(this.cx + (2 / 3) * this.cs * 3, this.cy - 10, this.cs, this.cs);
    ellipse(this.cx + (2 / 3) * this.cs * 3, this.cy + 10, this.cs, this.cs);
    ellipse(this.cx + (2 / 3) * this.cs * 4, this.cy, this.cs, this.cs);
    pop();
  }

  move() {
    let xoff1 = 0;
    let xoff2 = 0;
    //here I use the noise to move the clouds, but I wasn't able to do it the right way, because like this I only use one value of the noise, so it creates a linear movement
    this.cx += map(noise(xoff1), 0, 1, 0, width) / 1000;
    this.cy += map(noise(xoff2), 0, 1, 0, height) / 1000;

    if (this.cx > width) {
      this.cx = random(-500, -100); // when they exit from view, they return back to the left
      this.cy = random(0, height);
    }
  }
}

//function to make the canvas responsive
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//function that create a new snowflake everytime mouse is clicked
function mouseClicked() {
  snowflakes.push(new Snowflake(mouseX, mouseY));
}
