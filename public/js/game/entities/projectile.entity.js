export default class Projectile {

    constructor() {

        this.pos = { x: 0, y: 0 };
        this.scale = { x: 10, y: 10 };
        this.color = { r: 255, g: 0, b: 255, a: 255 };
        this.xdir = 0;
        this.ydir = 0;

        this.lifeTime = 0;
        this.maxLifeTime = 100;

        this.speed = 10;
    }

    shootProjectileAtTo(x, y, xdir, ydir) {

        this.pos.x = x;
        this.pos.y = y;

        this.xdir = xdir;
        this.ydir = ydir;

    }

    updateProjectile() {

        this.pos.x += this.xdir * this.speed;
        this.pos.y += this.ydir * this.speed;

        this.lifeTime++;

    }

}