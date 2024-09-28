export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}  

export class Photon {
    constructor(pos, xspeed, yspeed) {
        this.pos = pos;
        this.xspeed = xspeed;
        this.yspeed = yspeed;
    }

    getPos(){
        return this.pos;
    }

    getXspeed() {
        return this.xspeed;
    }

    getYspeed() {
        return this.yspeed;
    }

    // probes the next position and returns it
    probePos() {
        newX = this.x + this.xspeed;
        newY = this.y + this.yspeed;
        return new Point(newX,newY);
    }

    // updates position according to speed
    updatePos() {
        newX = this.x + this.xspeed;
        newY = this.y + this.yspeed;
        this.pos.x = newX;
        this.pos.y = newY;
    }

    // changes speed according to modifiers dx and dy
    bounce() {
        this.pos.x = dx * this.pos.x;
        this.pos.y = dx * this.pos.y;
    }
}
  