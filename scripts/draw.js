
const vertices = [{x: 100, y: 100}, {x: 300, y: 600}, {x: 700, y: 400}]; // will making them objects create a mutability problem?
const mouseSens = 9;
let grabbing_staged = false;
let grabbing = false;
let grabbed_vtx;
const orthoLen = 800;
let orthos = [];

function setup() {
  createCanvas(800, 800);
  background(220);

  drawTriangle();
  orthos = [];
  vertices.forEach((v, i) => {
    const next = (i+1) % 3;
    const other = vertices[next];
    const p = findMidpoint(v, other);
    const m = findSlope(v, other);
    orthos.push({m: m, p: p});
  });
}

function draw() {
  background(220);
  drawTriangle();
  orthos = [];

  // Calculate new orthogonal lines given current vertices:
  vertices.forEach((v, i) => {
    const next = (i+1) % 3;
    const other = vertices[next];
    const p = findMidpoint(v, other);
    const m = findSlope(v, other);
    orthos.push({m: m, p: p});
  });
  // Draw orthogonal lines:
  orthos.forEach(o => {
    drawLine(o.m, o.p);
  });

  // Determine where first two orthos intersect:
  // AH! for some reason we're calcuating inverse slope in the drawLine, instead of passing it in. So need to calculate it here.
  let center = {};
  center.x = (orthos[0].p.y - orthos[1].p.y - 1/orthos[1].m * orthos[1].p.x + 1/orthos[0].m * orthos[0].p.x)/(1/orthos[0].m - 1/orthos[1].m);
  center.y = orthos[1].p.y - 1/orthos[1].m * (center.x - orthos[1].p.x);

  const radius = dist(center.x, center.y, vertices[0].x, vertices[0].y);

  fill('steelblue');
  ellipse(center.x, center.y, 4);
  noFill();
  stroke('steelblue');
  ellipse(center.x, center.y, 2 * radius);

  // Determine incenter:
  let incenter = {};
  const v1 = vertices[0];
  const v2 = vertices[1];
  const v3 = vertices[2];
  const d12 = dist(v1.x, v1.y, v2.x, v2.y);
  const d23 = dist(v2.x, v2.y, v3.x, v3.y);
  const d31 = dist(v3.x, v3.y, v1.x, v1.y);
  const peri = d12 + d23 + d31;
  incenter.x = (d12*v3.x + d23*v1.x + d31*v2.x) / peri;
  incenter.y = (d12*v3.y + d23*v1.y + d31*v2.y) / peri;
  fill('tomato');
  ellipse(incenter.x, incenter.y, 4);

  // Draw lines connecting vertices to incenter:
  stroke('tomato');
  line(incenter.x, incenter.y, v1.x, v1.y);
  line(incenter.x, incenter.y, v2.x, v2.y);
  line(incenter.x, incenter.y, v3.x, v3.y);

  // Determine radial length of incircle:
  // Use law of cosines:
  const angle = acos((d12*d12 + d23*d23 - d31*d31) / (2 * d12 * d23));
  const incenter_to_vtx = dist(incenter.x, incenter.y, vertices[1].x, vertices[1].y);
  const inradius = incenter_to_vtx * sin(angle/2);
  noFill();
  ellipse(incenter.x, incenter.y, inradius * 2);
  // console.log(radius/inradius);
}


function drawTriangle() {
  for (let i=0; i < vertices.length; i++) {
    const next = (i+1) % 3; // 2 goes to 0;
    const p1 = vertices[i];
    const p2 = vertices[next];
    stroke('black');
    line(p1.x, p1.y, p2.x, p2.y);
    noStroke();
    fill('steelblue'); // lol blue steel
    ellipse(p1.x, p1.y, 4);
  }
}

function mouseMoved() {
  grabbing_staged = false; // this makes grabbing_staged meaningful: now clicking someone WON'T just bring the most recently clicked vertex to that point.
  vertices.forEach((v, i) => {
    if (abs(mouseX - v.x) < mouseSens && abs(mouseY - v.y) < mouseSens) {
      grabbing_staged = true;
      grabbed_vtx = v;
    }
  });
  cursor_style = grabbing_staged ? HAND : ARROW;
  cursor(cursor_style);
}

// Moves the grabbed vertex:
function mouseDragged() {
  if (grabbing_staged) {
    grabbing = true;
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

// For orthogonal bisectors:
function drawLine(m, p) {
  // console.log(m, p);
  const inv_slope = - 1 / m; // ignore the minus sign because of negative-y orientation with canvas.
  // console.log(inv_slope);
  const xStart = p.x - orthoLen;
  const yStart = p.y - orthoLen * inv_slope;
  const xEnd = p.x + orthoLen;
  const yEnd = p.y + orthoLen * inv_slope;
  stroke('green');
  line(xStart, yStart, xEnd, yEnd);
}
