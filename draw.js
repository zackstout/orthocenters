
const vertices = [{x: 100, y: 100}, {x: 300, y: 600}, {x: 700, y: 400}]; // will making them objects create a mutability problem?
const mouseSens = 5;
let grabbing_staged = false;
let grabbing = false;
let grabbed_vtx;

function setup() {
  createCanvas(800, 800);
  background(220);

  drawTriangle();
}

function draw() {
  background(220);
  drawTriangle();
}


function drawTriangle() {
  for (let i=0; i < vertices.length; i++) {
    const next = (i+1) % 3; // 2 goes to 0;
    const p1 = vertices[i];
    const p2 = vertices[next];
    // console.log(p1, p2);
    stroke('black');
    line(p1.x, p1.y, p2.x, p2.y);
    noStroke();
    fill('steelblue'); // lol blue steel
    ellipse(p1.x, p1.y, 4);
  }
}

function mouseMoved() {
  // console.log(mouseX, mouseY);
  vertices.forEach(v => {
    if (abs(mouseX - v.x) < mouseSens && abs(mouseY - v.y) < mouseSens) {
      console.log('ay');
      grabbing_staged = true;
      grabbed_vtx = v;
    }
  });
}

function mousePressed() {
  if (grabbing_staged) {
    grabbing = true;
    console.log('pressed');
  }

}

function mouseDragged() {
  if (grabbing) {
    grabbed_vtx.x = mouseX;
    grabbed_vtx.y = mouseY;
  }
}