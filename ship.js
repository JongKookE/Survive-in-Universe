function Ship() {
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
    this.isDestroyed = true;
    for (var i = 0; i < 4; i++)
      this.brokenParts[i] = {
        pos: this.pos.copy(),
        vel: p5.Vector.random2D(),
        heading: random(0, 360),
        rot: random(-0.07, 0.07)
      };
  }

 this.hits = function(asteroid) {
    var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    if (d < this.r + asteroid.r) {
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
