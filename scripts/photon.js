export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

export class Photon {
  constructor(pos, xspeed, yspeed) {
    this.pos = pos; // Instance of Point
    this.xspeed = xspeed; // Speed along the x-axis
    this.yspeed = yspeed; // Speed along the y-axis
  }

  getPos() {
    return this.pos;
  }

  getXspeed() {
    return this.xspeed;
  }

  getYspeed() {
    return this.yspeed;
  }

  // Probes the next position and returns a new Point
  probePos() {
    const nextX = this.pos.x + this.xspeed; // Calculate next x-coordinate
    const nextY = this.pos.y + this.yspeed; // Calculate next y-coordinate
    return new Point(nextX, nextY); // Return a new Point with the next position
  }

  // Updates position according to speed
  updatePos() {
    this.pos.x += this.xspeed;
    this.pos.y += this.yspeed;
  }

  // Changes speed according to dx and dy (1 or -1)
  bounce(dx, dy) {
    this.xspeed *= dx;
    this.yspeed *= dy;
  }
}
