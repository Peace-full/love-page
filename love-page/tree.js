/*
 * tree.js -animated love-tree
 * ------------------------------------------------
 * Adapted (rewritten) from the open-source project:
 *   LoveTree by 霸都丶傲天 (AJLoveChina)
 *   https://github.com/AJLoveChina/LoveTree
 * Original project declared MIT licensed in its README.
 * This adaptation: copyright Peace-full, MIT licensed.
 * See THIRD_PARTY_NOTICES.md for full attribution.
 */
const CONFIG = {
  // CHANGE THIS: your anniversary date (YYYY-MM-DD)
  memorialDate: "2024-01-01T00:00:00",
  seedText: "Love",
  tree: {
    seed: { x: 260, y: 170, color: "rgb(201, 24, 74)", scale: 2.8 },
    branches: [
      {
        from: [253, 340], control: [269, 125], to: [236, 100], radius: 18, steps: 80,
        children: [
          { from: [255, 250], control: [215, 208], to: [161, 200], radius: 8, steps: 80,
            children: [{ from: [213, 217], control: [205, 215], to: [186, 197], radius: 2, steps: 30 }]
          },
          { from: [260, 222], control: [284, 178], to: [321, 172], radius: 7, steps: 80,
            children: [{ from: [273, 200], control: [306, 204], to: [312, 213], radius: 2, steps: 60 }]
          },
          { from: [255, 140], control: [254, 124], to: [252, 108], radius: 2, steps: 30 },
          { from: [258, 198], control: [195, 123], to: [155, 122], radius: 5, steps: 70,
            children: [
              { from: [202, 143], control: [181, 126], to: [175, 102], radius: 2, steps: 30 },
              { from: [235, 172], control: [205, 157], to: [187, 165], radius: 3, steps: 50 }
            ]
          },
          { from: [258, 178], control: [287, 126], to: [321, 110], radius: 4, steps: 80,
            children: [{ from: [279, 146], control: [305, 138], to: [306, 135], radius: 2, steps: 60 }]
          }
        ]
      }
    ],
    bloom: { num: 350, width: 500, height: 310 },
    footer: { width: 600, height: 4, speed: 8 }
  }
};

const StageConfig = { width: 520, height: 340 };
const TreeRenderConfig = { radiusDecay: 0.96 };

/* warm pastel petals instead of raw random rgb */
const BLOOM_PALETTE = [
  "rgb(255,183,197)",
  "rgb(255,205,178)",
  "rgb(255,226,178)",
  "rgb(250,214,222)",
  "rgb(255,158,183)",
  "rgb(248,205,180)",
  "rgb(236,214,240)"
];

function randomInt(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }
function randomFloat(min, max) { return min + Math.random() * (max - min); }
function randomBloomColor() { return BLOOM_PALETTE[randomInt(0, BLOOM_PALETTE.length - 1)]; }

function bezier(points, t) {
  const p0 = points[0], p1 = points[1], p2 = points[2];
  const s = 1 - t;
  return new Point(
    p0.x * s * s + 2 * p1.x * s * t + p2.x * t * t,
    p0.y * s * s + 2 * p1.y * s * t + p2.y * t * t
  );
}

function inHeart(x, y, r) {
  const nx = x / r, ny = y / r;
  return (nx ** 2 + ny ** 2 - 1) ** 3 - nx ** 2 * ny ** 3 < 0;
}

class Point {
  constructor(x = 0, y = 0) { this.x = x; this.y = y; }
  set(x, y) { this.x = x; this.y = y; }
}

class Heart {
  constructor() {
    this.points = [];
    for (let angle = 10; angle < 30; angle += 0.2) {
      const t = angle / Math.PI;
      const x = 16 * Math.sin(t) ** 3;
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      this.points.push(new Point(x, y));
    }
    this.path = this.buildPath();
  }
  buildPath() {
    const path = new Path2D();
    const points = this.points;
    const p0x = points[0].x, p0y = -points[0].y;
    path.moveTo(p0x, p0y);
    for (let i = 0; i < points.length - 1; i++) {
      const cx = points[i].x, cy = -points[i].y;
      const nx = points[i + 1].x, ny = -points[i + 1].y;
      path.quadraticCurveTo(cx, cy, (cx + nx) / 2, (cy + ny) / 2);
    }
    const last = points[points.length - 1];
    path.quadraticCurveTo(last.x, -last.y, p0x, p0y);
    path.closePath();
    return path;
  }
}

class Seed {
  constructor(tree, point, scale = 1, color = "#FF0000", config = {}) {
    this.tree = tree;
    this.config = config;
    this.heart = { point, scale, color, figure: new Heart() };
    this.circle = { point: new Point(point.x, point.y), scale, color, radius: 5 };
  }
  draw() { this.drawHeart(); this.drawText(); }
  canMove() { return this.circle.point.y < this.tree.height + 20; }
  canScale() { return this.heart.scale > 0.2; }
  move(x, y) {
    this.clear();
    this.drawCircle();
    const { point } = this.circle;
    point.set(point.x + x, point.y + y);
  }
  scale(s) {
    this.clear();
    this.drawCircle();
    this.drawHeart();
    this.heart.scale *= s;
  }
  drawHeart() {
    const { ctx } = this.tree;
    const { point, color, scale, figure } = this.heart;
    ctx.save();
    ctx.fillStyle = color;
    ctx.translate(point.x, point.y);
    ctx.scale(scale, scale);
    ctx.fill(figure.path);
    ctx.restore();
  }
  drawCircle() {
    const { ctx } = this.tree;
    const { point, color, scale, radius } = this.circle;
    ctx.save();
    ctx.fillStyle = color;
    ctx.translate(point.x, point.y);
    ctx.scale(scale, scale);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  drawText() {
    const { ctx } = this.tree;
    const { point, color, scale } = this.heart;
    const text = this.config.seedText || "Love";
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.translate(point.x, point.y);
    ctx.scale(scale, scale);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(15, 15);
    ctx.lineTo(60, 15);
    ctx.stroke();
    ctx.moveTo(0, 0);
    ctx.scale(0.75, 0.75);
    ctx.font = "12px sans-serif";
    ctx.fillText(text, 23, 10);
    ctx.restore();
  }
  clear() {
    const { ctx } = this.tree;
    const { point, scale } = this.circle;
    const w = 26 * scale, h = 26 * scale;
    ctx.clearRect(point.x - w, point.y - h, 4 * w, 4 * h);
  }
}

class Footer {
  constructor(tree, width, height, speed = 2) {
    this.tree = tree;
    this.point = new Point(tree.seed.heart.point.x, tree.height - height / 2);
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.length = 0;
  }
  draw(ctx) {
    ctx = ctx || this.tree.groundCtx;
    const { point, height, length, width } = this;
    ctx.save();
    ctx.strokeStyle = "rgb(201, 24, 74)";
    ctx.lineWidth = height;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.translate(point.x, point.y);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(length / 2, 0);
    ctx.lineTo(-length / 2, 0);
    ctx.stroke();
    ctx.restore();
    if (length < width) this.length += this.speed;
  }
}

class Branch {
  constructor(tree, p1, p2, p3, radius, steps = 100, children = []) {
    this.tree = tree;
    this.curve = [p1, p2, p3];
    this.initialRadius = radius;
    this.steps = steps;
    this.children = children;
    this.step = 0;
  }
  currentRadius() {
    return this.initialRadius * Math.pow(TreeRenderConfig.radiusDecay, this.step);
  }
  grow() {
    if (this.step >= this.steps) {
      this.tree.removeBranch(this);
      this.tree.addBranches(this.children);
      return;
    }
    const t0 = this.step / this.steps;
    const t1 = (this.step + 1) / this.steps;
    const start = bezier(this.curve, t0);
    const end = bezier(this.curve, t1);
    const { ctx } = this.tree;
    const r = this.currentRadius();
    ctx.save();
    ctx.strokeStyle = "rgb(201, 24, 74)";
    ctx.lineWidth = r * 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = "rgb(201, 24, 74)";
    ctx.shadowBlur = 3;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.restore();
    this.step++;
  }
}

class Bloom {
  constructor(tree, point, figure,
    color = randomBloomColor(),
    alpha = randomFloat(0.3, 1),
    angle = randomFloat(0, Math.PI * 2),
    scale = 0.1) {
    this.tree = tree;
    this.point = point;
    this.color = color;
    this.alpha = alpha;
    this.angle = angle;
    this.scale = scale;
    this.figure = figure;
    this.vx = 0;
    this.vy = 0;
    this.swing = 0.02;
    this.swingAmp = 0.6;
    this.wind = 0;
    this.phase = 0;
    this.spin = 0.02;
  }
  flower() {
    this.drawOn(this.tree.ctx);
    this.scale += 0.1;
    return this.scale <= 1;
  }
  drawOn(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.point.x, this.point.y);
    ctx.scale(this.scale, this.scale);
    ctx.rotate(this.angle);
    ctx.fill(this.figure.path);
    ctx.restore();
  }
  fall(dt) {
    const { x, y } = this.point;
    if (x < -40 || x > this.tree.width + 40 || y > this.tree.height + 40) {
      this.alpha = 0;
      return;
    }
    this.drawOn(this.tree.dynamicCtx);
    const f = dt / 16;
    this.vy += 0.018 * f;
    this.vy = Math.min(this.vy, 1.3);
    this.vx += this.wind * 0.01 * f;
    const sway = Math.sin(this.phase + y * this.swing) * this.swingAmp * f;
    this.point.set(x + this.vx * f + sway, y + this.vy * f);
    this.angle += this.spin * f;
    this.alpha = Math.max(this.alpha - 0.0006 * f, 0);
  }
}

function toPoint([x, y]) { return new Point(x, y); }

class Tree {
  constructor(staticCanvas, dynamicCanvas, groundCanvas, width, height, opt = {}, config = {}) {
    this.staticCanvas = staticCanvas;
    this.ctx = staticCanvas.getContext("2d");
    this.dynamicCanvas = dynamicCanvas;
    this.dynamicCtx = dynamicCanvas.getContext("2d");
    this.groundCanvas = groundCanvas;
    this.groundCtx = groundCanvas.getContext("2d");
    this.width = width;
    this.height = height;
    this.opt = opt;
    this.config = config;
    this.initSeed();
    this.initFooter();
    this.initBranch();
    this.initBloom();
  }
  initSeed() {
    const { x = this.width / 2, y = this.height / 2, color = "#FF0000", scale = 1 } = this.opt.seed || {};
    this.seed = new Seed(this, new Point(x, y), scale, color, this.config);
  }
  initFooter() {
    const { width = this.width, height = 5, speed = 2 } = this.opt.footer || {};
    this.footer = new Footer(this, width, height, speed);
  }
  initBranch() {
    this.branches = [];
    this.addBranches(this.opt.branches || []);
  }
  initBloom() {
    const { num = 500, width = this.width, height = this.height } = this.opt.bloom || {};
    const figure = this.seed.heart.figure;
    this.blooms = [];
    this.bloomsCache = Array.from({ length: num }, () => this.createBloom(width, height, 120, figure));
    this.fallingBlooms = [];
  }
  addBranches(branches) {
    branches.forEach(({ from, control, to, radius, steps, children = [] }) => {
      this.branches.push(new Branch(this, toPoint(from), toPoint(control), toPoint(to), radius, steps, children));
    });
  }
  removeBranch(branch) { this.branches = this.branches.filter((b) => b !== branch); }
  canGrow() { return this.branches.length > 0; }
  grow() { this.branches.forEach((b) => b?.grow()); }
  createBloom(width, height, radius, figure) {
    const maxAttempts = 1000;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const x = Math.random() * (width - 40) + 20;
      const y = Math.random() * (height - 40) + 20;
      if (inHeart(x - width / 2, height - (height - 40) / 2 - y, radius)) {
        return new Bloom(this, new Point(x, y), figure);
      }
    }
    return new Bloom(this, new Point(width / 2, height / 2), figure);
  }
  canFlower() { return this.bloomsCache.length > 0; }
  flower(num) {
    this.blooms.push(...this.bloomsCache.splice(0, num));
    for (let i = 0; i < this.blooms.length; i++) {
      if (!this.blooms[i].flower()) {
        this.blooms.splice(i, 1);
        i--;
      }
    }
  }
  createFallingBloom() {
    const figure = this.seed.heart.figure;
    const crown = { x: this.width / 2 + 80, y: this.height * 0.42 };
    const bloom = new Bloom(
      this,
      new Point(crown.x + randomFloat(-80, 90), crown.y + randomFloat(-70, 35)),
      figure,
      randomBloomColor(),
      randomFloat(0.65, 1),
      randomFloat(-0.8, 0.8),
      randomFloat(0.55, 0.95)
    );
    bloom.vx = randomFloat(-0.75, -0.15);
    bloom.vy = randomFloat(0.35, 0.9);
    bloom.swing = randomFloat(0.012, 0.028);
    bloom.swingAmp = randomFloat(0.35, 1.1);
    bloom.wind = randomFloat(-1.4, -0.55);
    bloom.phase = randomFloat(0, Math.PI * 2);
    bloom.spin = randomFloat(-0.018, 0.022);
    return bloom;
  }
  resetFallingBlooms() { this.blooms = []; this.fallingBlooms = []; }
  jump(dt) {
    for (let i = 0; i < this.fallingBlooms.length; i++) {
      const bloom = this.fallingBlooms[i];
      bloom.fall(dt);
      if (bloom.alpha <= 0) {
        this.fallingBlooms.splice(i, 1);
        i--;
      }
    }
    if (this.fallingBlooms.length < 4 && Math.random() < 0.22) {
      this.fallingBlooms.push(this.createFallingBloom());
    }
  }
}

function nextFrame() { return new Promise((resolve) => requestAnimationFrame(resolve)); }
function wait(duration) { return new Promise((resolve) => setTimeout(resolve, duration)); }

async function runUntil(isDone, step, interval = 16) {
  let last = 0;
  while (!isDone()) {
    const now = await nextFrame();
    if (now - last >= interval) { step(); last = now; }
  }
}

function startFrameLoop(step, interval = 16) {
  let last = 0, frameId = 0, running = true;
  function tick(now) {
    if (!running) return;
    if (now - last >= interval) { step(now); last = now; }
    frameId = requestAnimationFrame(tick);
  }
  frameId = requestAnimationFrame(tick);
  return function stop() { running = false; cancelAnimationFrame(frameId); };
}

function animateSeedShrink(seed) {
  return runUntil(() => !seed.canScale(), () => seed.scale(0.95), 10);
}
function animateSeedMove(seed, footer) {
  return runUntil(() => !seed.canMove(), () => { seed.move(0, 2); footer.draw(); }, 10);
}
function animateTreeGrow(tree) {
  return runUntil(() => !tree.canGrow(), () => tree.grow(), 10);
}
function animateFlowerBloom(tree) {
  return runUntil(() => !tree.canFlower(), () => tree.flower(2), 10);
}
async function animateTreeMove(staticCanvas) {
  staticCanvas.classList.add("shifted");
  await wait(1600);
}

function startHeartJumpAnimation(tree) {
  const { dynamicCtx, width, height } = tree;
  let lastTime = 0;
  function render(now) {
    const dt = Math.min(lastTime ? now - lastTime : 16, 50);
    lastTime = now;
    dynamicCtx.clearRect(0, 0, width, height);
    tree.jump(dt);
  }
  let stop = startFrameLoop(render, 25);
  function handleVisibilityChange() {
    if (document.hidden) { stop(); } else { lastTime = 0; stop = startFrameLoop(render, 25); }
  }
  document.addEventListener("visibilitychange", handleVisibilityChange);
}

function initCanvas(id) {
  const canvas = document.getElementById(id);
  const { width: w, height: h } = StageConfig;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  canvas.getContext("2d").scale(dpr, dpr);
  return canvas;
}

function scaleTreeStage() {
  const wrapper = document.getElementById("treeWrapper");
  const stage = document.getElementById("treeStage");
  if (!wrapper || !stage) return;
  const wrapperWidth = wrapper.clientWidth;
  const scale = Math.min(wrapperWidth / StageConfig.width, 1);
  stage.style.transform = `scale(${scale})`;
  wrapper.style.height = `${StageConfig.height * scale}px`;
}

let treeAppStarted = false;

async function startTreeApp() {
  if (treeAppStarted) return;
  treeAppStarted = true;

  scaleTreeStage();
  window.addEventListener("resize", scaleTreeStage);

  const staticCanvas = initCanvas("staticCanvas");
  const groundCanvas = initCanvas("groundCanvas");
  const dynamicCanvas = initCanvas("dynamicCanvas");

  const tree = new Tree(
    staticCanvas, dynamicCanvas, groundCanvas,
    StageConfig.width, StageConfig.height,
    CONFIG.tree, CONFIG
  );
  const { seed, footer } = tree;

  seed.draw();
  document.getElementById("treeHint").classList.add("hidden");

  await animateSeedShrink(seed);
  await animateSeedMove(seed, footer);
  await animateTreeGrow(tree);
  await animateFlowerBloom(tree);
  tree.resetFallingBlooms();

  footer.draw();
  await animateTreeMove(staticCanvas);

  startHeartJumpAnimation(tree);
}

function triggerTreeGrowth() {
  if (!window.treeAppStarted && typeof startTreeApp === "function") {
    const btn = document.getElementById("treeTriggerBtn");
    if (btn) {
      btn.disabled = true;
      btn.textContent = "🌱 Growing...";
      btn.style.opacity = "0.6";
    }
    startTreeApp();
  }
}
