var ship;
var asteroids = [];
var lasers = [];
var items = [];
var score=0;
let bgm;
let distroyasteroid;
let getstar;
let gameover;

function setup() {
  bgm.play(); // 배경음악 재생
  createCanvas(windowWidth, windowHeight);
  ship = new Ship();
  for (var i = 0; i < 10; i++) { // asteroid 갯수 설정
    asteroids.push(new Asteroid());
    
  }
  for (var i = 0; i < 5; i++) { // item 갯수 설정
    items.push(new item());
  }
}

function draw() {
  background(0);
  score+=0.1; // score 설정
  stroke(255, 255);
  textSize(30);
  fill(255, 255, 255);
  text("SCORE : "+Math.ceil(score),10,30);
  console.log(score);
  for(var it=0; it<items.length; it++){ 
    if(ship.hits_item(items[it])){ // item이 ship이랑 부딪히면
    items[it].destroy(); //      // item이 사라짐
    }
     items[it].render(); // item 불러오기
     items[it].edges();
   }
   
  for (var i = 0; i < asteroids.length; i++) { //asteroid 생성
    if (ship.hits(asteroids[i])) {
      ship.destroy();
      asteroids[i].update();
    }
  
    asteroids[i].render();
    asteroids[i].update();
    asteroids[i].edges();
   
    //asteroids[i].update();
    
  }



  for (var i = lasers.length - 1; i >= 0; i--) { // 레이저 생성 및
                                                 // 파괴 
    lasers[i].render();
    lasers[i].update();
    if (lasers[i].offscreen()) {
      lasers.splice(i, 1);
    } else {
      for (var j = asteroids.length - 1; j >= 0; j--) {
        if (lasers[i].hits(asteroids[j])) {
          destroyasteroid.play();
          if (asteroids[j].r > 10) {
            var newAsteroids = asteroids[j].breakup();
            asteroids = asteroids.concat(newAsteroids);
          }
          asteroids.splice(j, 1);
          lasers.splice(i, 1);
          break;
        }
      }
    }
  }

  console.log(lasers.length);

  ship.render();
  ship.turn();
  ship.update();
  ship.edges();


}

function keyReleased() { 
  ship.setRotation(0);
  ship.boosting(false);
}

function keyPressed() { // 방향 및 
  if (key == ' ') {
    lasers.push(new Laser(ship.pos, ship.heading));
  } else if (keyCode == RIGHT_ARROW) {
    ship.setRotation(0.1);
  } else if (keyCode == LEFT_ARROW) {
    ship.setRotation(-0.1);
  } else if (keyCode == UP_ARROW) {
    ship.boosting(true);
  }
}

function Asteroid(pos, r) { // 운석 크기 및 속도, 모습
  if (pos) {
    this.pos = pos.copy();
  } else {
    this.pos = createVector(random(width), random(height));
  }
  if (r) {
    this.r = r * 0.5;
  } else {
    this.r = random(15, 50);
  }

  this.vel = p5.Vector.random2D();
  this.total = floor(random(5, 15));
  this.offset = [];
  for (var i = 0; i < this.total; i++) {
    this.offset[i] = random(-this.r * 0.5, this.r * 0.5);
  }

  this.update = function() {
    this.pos.add(this.vel);
  }

  this.render = function() {
    push();
    stroke(255);
    noFill();
    translate(this.pos.x, this.pos.y);
    //ellipse(0, 0, this.r * 2);
    beginShape();
    for (var i = 0; i < this.total; i++) {
      var angle = map(i, 0, this.total, 0, TWO_PI);
      var r = this.r + this.offset[i];
      var x = r * cos(angle);
      var y = r * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }

  this.breakup = function() { // 운석 파괴의 형태
    var newA = [];
    newA[0] = new Asteroid(this.pos, this.r);
    newA[1] = new Asteroid(this.pos, this.r);
    return newA;
  }
   this.vertices = function() {
    var vertices = [];
    for(var i = 0; i < this.total; i++) {
      var angle = this.heading + map(i, 0, this.total, 0, TWO_PI);
      var r = this.r + this.offset[i];
      var vec = createVector(r * cos(angle), r * sin(angle));
      vertices.push(p5.Vector.add(vec, this.pos));
    }

    return vertices;
  }


  this.edges = function() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }
  
}

var img;
function preload(){ //이미지 및 사운드 가져오기
  img = loadImage("star.png");
  soundFormats('mp3');
  bgm = loadSound('bgm');
  destroyasteroid = loadSound('destroyasteroid');
  getstar = loadSound('getstar');
  gameover = loadSound('gameover');
}



function item(pos, r) { // 아이템 구현 및 아이템의 
    this.pos = createVector(random(width), random(height));
   /*
  if (r) {
    this.r = r * 0.5;
  } else {
    this.r = random(15, 50);
  }
  */
  this.r = 20;
  
  this.total = floor(random(5, 15));
  this.offset = [];
  for (var i = 0; i < this.total; i++) {
    this.offset[i] = random(-this.r * 0.5, this.r * 0.5);
  }
 
 this.upScore= function(){
   
       score+=1000;
 }
  this.destroy= function(){
    this.upScore();
    push();
   this.pos.x=-100;
   this.pos.y=-100;

   pop();
}
  this.render = function() {
    push();
    stroke(255);
    noFill();
    translate(this.pos.x, this.pos.y);
    //ellipse(0, 0, this.r * 2);
    image(img,0,0,this.r,this.r);
    pop();
  }


  this.edges = function() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }
  
}

function Laser(spos, angle) { // 레이저의 위치, 속도, 방향
  this.pos = createVector(spos.x, spos.y);
  this.vel = p5.Vector.fromAngle(angle);
  this.vel.mult(10);

  this.update = function() {
    this.pos.add(this.vel);
  }
  
  this.render = function() {
    push();
    stroke(255);
    strokeWeight(4);
    point(this.pos.x, this.pos.y);
    pop();
  }

  this.hits = function(asteroid) {
    var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    if (d < asteroid.r) {
      
      return true;
    } else {
      return false;
    }
  }

  this.offscreen = function() {
    if (this.pos.x > width || this.pos.x < 0) {
      return true;
    }
    if (this.pos.y > height || this.pos.y < 0) {
      return true;
    }
    return false;
  }


}

function Ship() { // Ship의 위치, 크기, 방향 및 다양한 설정 구현
  this.pos = createVector(width / 2, height / 2);
  this.r = 20;
  this.heading = 0;
  this.rotation = 0;
  this.vel = createVector(0, 0);
  this.isBoosting = false;
  this.isDestroyed = false;
  
  this.boosting = function(b) {
    this.isBoosting = b;
  }

  this.update = function() {
    
    this.vel.mult(0.99);
    if (this.isDestroyed) {
      
      for (var i = 0; i < this.brokenParts.length; i++) {
        this.brokenParts[i].pos.add(this.brokenParts[i].vel);
        this.brokenParts[i].heading += this.brokenParts[i].rot;
    } 
    } else {
      this.vel.mult(0.99);
    }
    if (this.isBoosting) {
      this.boost();
      
    }
    this.pos.add(this.vel);
    this.vel.mult(0.99);
  }

  this.boost = function() {
    var force = p5.Vector.fromAngle(this.heading);
    force.mult(0.1);
    this.vel.add(force);
  }
  
  this.brokenParts = [];
  this.destroy = function() {
    console.log("distroyed");
    
    
    
    for (var i = 0; i < 4; i++)
      this.brokenParts[i] = {
        pos: this.pos.copy(),
        vel: p5.Vector.random2D(),
        heading: random(0, 360),
        rot: random(-0.07, 0.07)
      };
  }
  
   this.hits_item = function(item) {
      var d = dist(this.pos.x, this.pos.y, item.pos.x, item.pos.y);
    if (d < this.r + item.r) {
      console.log("item_");
      getstar.play();
      return true;
    } else {
      return false;
    }
 }

 this.hits = function(asteroid) {
    var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    if (d < this.r + asteroid.r) {
      gameover.play();
      stroke(6000);
      textSize(100);
      text('GAME OVER',windowWidth/2-250,windowHeight/2);
      
      exit();
      return true;
    } else {
      return false;
    }
    var vertices = [
      createVector(-2 / 3 * this.r, this.r).rotate(this.heading),
      createVector(-2 / 3 * this.r, -this.r).rotate(this.heading),
      createVector(4 / 3 * this.r, 0).rotate(this.heading)
    ];
    for(var i = 0; i < vertices.length; i++) {
      vertices[i] = p5.Vector.add(vertices[i], this.pos);
    }
    var asteroid_vertices = asteroid.vertices();

    for (var i = 0; i < asteroid_vertices.length; i++) {
      for (var j = 0; j < vertices.length; j++) {
        var next_i = (i + 1) % asteroid_vertices.length;
        if (lineIntersect(vertices[j], vertices[(j + 1) % vertices.length],
                          asteroid_vertices[i], asteroid_vertices[next_i])) {
          return true;
        }
      }
    }
    return false;
  }
  this.render = function() {
    if (this.isDestroyed) {
      
      for (var i = 0; i < this.brokenParts.length; i++) {
        push();
        stroke(floor(255 * ((this.destroyFrames--) / 600)));
        var bp = this.brokenParts[i];
        translate(bp.pos.x, bp.pos.y);
        ate(bp.heading);
        line(-this.r / 2, -this.r / 2, this.r / 2, this.r / 2);
        pop();
        
      }
    } else{
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading + PI / 2);
    fill(0);
    stroke(255);
    triangle(-this.r, this.r, this.r, this.r, 0, -this.r);
    pop();
  }
  }
  this.edges = function() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }

  this.setRotation = function(a) {
    this.rotation = a;
  }

  this.turn = function() {
    this.heading += this.rotation;
  }
  }
