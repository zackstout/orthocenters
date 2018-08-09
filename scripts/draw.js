
const vertices = [{x: 100, y: 100}, {x: 300, y: 600}, {x: 700, y: 400}]; // will making them objects create a mutability problem?
const mouseSens = 9;
let grabbing_staged = false;
let grabbing = false;
let grabbed_vtx;
let orthos = [];

// expected mdpts: (200, 350), (400, 250), (500, 500) -- It works!

function setup() {
  createCanvas(800, 800);
  background(220);

  drawTriangle();
}

function draw() {
  background(220);
  drawTriangle();
  orthos.forEach(o => {
    drawLine(o.m, o.p);
  });
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
  orthos = [];
  vertices.forEach((v, i) => {
    if (abs(mouseX - v.x) < mouseSens && abs(mouseY - v.y) < mouseSens) {
      // console.log('ay');
      grabbing_staged = true;
      grabbed_vtx = v;

    }

    const next = (i+1) % 3;
    const other = vertices[next];
    const p = findMidpoint(v, other);
    const m = findSlope(v, other);
    orthos.push({m: m, p: p});
    // drawLine(m, p);
    // console.log(m, s);
  });
}

// It seems we can get rid of this -- mouseDragged triggers it:
// function mousePressed() {
//   if (grabbing_staged) {
//     grabbing = true;
//     // console.log('pressed');
//   }
// }

// Moves the grabbed vertex:
function mouseDragged() {
  if (grabbing_staged) {
    grabbing = true; // not sure whether this is needed
    grabbed_vtx.x = mouseX;
    grabbed_vtx.y = mouseY;
  }
}

function findMidpoint(p1, p2) {
  return {
    x: min([p1.x, p2.x]) + abs(p1.x - p2.x)/2,
    y: min([p1.y, p2.y]) + abs(p1.y - p2.y)/2
  };
}

function findSlope(p1, p2) {
  return (p1.y - p2.y) / (p1.x - p2.x);
}

function drawLine(m, p) {
  console.log(m, p);
  const inv_slope = - 1 / m; // ignore the minus sign because of negative-y orientation with canvas.
  // console.log(inv_slope);
  const xStart = p.x - 600;
  const yStart = p.y - 600 * inv_slope;
  const xEnd = p.x + 600;
  const yEnd = p.y + 600 * inv_slope;
  stroke('green');
  line(xStart, yStart, xEnd, yEnd);
}





// NOTE: Ok the UI isn't perfect, but it's kind of nice to be able to click a new spot and have most-recently-clicked vertex go there. I'm into it. (DON'T use the following function.)
// function mouseReleased() {
//   grabbing_staged = false;
//   grabbing = false;
//   grabbed_vtx = {};
// }
