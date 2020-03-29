const h = document.body.clientHeight;
const w = document.body.clientWidth;

const people = 140;

const { Engine, Render, World, Bodies, Body } = Matter;
let engine;
let y = 0;

let boxes;

let arrS = [],
  arrI = [],
  arrR = [];

function setup() {
  createCanvas(w, h);
  engine = Engine.create();
  world = engine.world;
  world.gravity.y = 0;
  boxes = [];
  for (let i = 1; i <= people; i++) {
    boxes.push(
      Bodies.circle(
        10 + Math.random() * (w - 10),
        10 + Math.random() * (h - 10),
        10,
        {
          restitution: 1,
          friction: 0,
          frictionAir: 0,
          frictionStatic: 0
        }
      )
    );
  }
  boxes.forEach(box => {
    const prob = random() > 0.98 ? true : false;
    box.status = prob ? 'I' : 'S';
    const xDir = Math.random() > 0.5 ? 1 : -1;
    const yDir = Math.random() > 0.5 ? 1 : -1;
    Body.setVelocity(box, {
      x: xDir * random(),
      y: yDir * random()
    });
  });
  wallOptions = {
    isStatic: true,
    restitution: 1,
    friction: 0,
    frictionAir: 0,
    frictionStatic: 0
  };
  leftWall = Bodies.rectangle(5, h / 2, 10, h, wallOptions);
  rightWall = Bodies.rectangle(w - 5, h / 2, 10, h, wallOptions);
  bottomWall = Bodies.rectangle(w / 2, h - 5, w, 10, wallOptions);
  topWall = Bodies.rectangle(w / 2, 5, w, 10, wallOptions);
  World.add(engine.world, [...boxes, leftWall, rightWall, bottomWall, topWall]);
  Engine.run(engine);
  console.log(boxes[0]);
  stroke(255, 255, 255);
}

function draw() {
  background(51, 51, 51);
  fill(0, 0, 0);
  noStroke();
  rectMode(CENTER);
  ellipseMode(CENTER);
  rect(leftWall.position.x, leftWall.position.y, 10, h);
  rect(rightWall.position.x, rightWall.position.y, 10, h);
  rect(bottomWall.position.x, bottomWall.position.y, w, 10);
  rect(topWall.position.x, topWall.position.y, w, 10);
  boxes.forEach(box => {
    noFill();
    if (box.status == 'R') fill(0, 255, 0);
    if (box.status == 'S') fill(255, 255, 255);
    if (box.status == 'I') fill(255, 0, 0);
    circle(box.position.x, box.position.y, 20);
    if (box.status == 'I') {
      const index = box.id;
      time = ((Math.random() * 10000) % 10) * 1000 + 3000;
      setTimeout(function() {
        world.bodies.filter(body => body.id == index)[0].status = 'R';
      }, time);
    }
  });
  for (let i = 0; i < boxes.length; i++) {
    for (j = 0; j < boxes.length; j++) {
      if (i != j) {
        const { collided, bodyA, bodyB } = Matter.SAT.collides(
          boxes[i],
          boxes[j]
        );
        if (collided) {
          if (bodyA.status == 'I' && bodyB.status != 'R') bodyB.status = 'I';
          if (bodyB.status == 'I' && bodyA.status != 'R') bodyA.status = 'I';
        }
      }
    }
  }
  let [S, I, R] = [0, 0, 0];
  boxes.forEach(box => {
    if (box.status == 'S') S++;
    if (box.status == 'I') I++;
    if (box.status == 'R') R++;
  });
  arrS.push(S);
  arrI.push(I);
  arrR.push(R);
  for (let i = 0; i < arrS.length; i++) {
    noFill();
    // fill(255);
    // circle(i, h - arrS[i] - 10, 5);
    fill('rgba(255, 0, 0, 0.3)');
    circle(10 + i, h - arrI[i] - 10, 5);
    rect(10 + i, h - 10 - arrI[i] / 2, 1, arrI[i]);
    if (arrR[i]) {
      fill('rgba(0, 255, 0, 0.3)');
      circle(10 + i, h - people + arrR[i] - 10, 5);
      rect(10 + i, h - people - 10 + arrR[i] / 2, 1, arrR[i]);
    }
  }

  y += 1;
  if (I == 0) {
    noLoop();
  }
}
