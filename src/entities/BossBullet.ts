import * as PIXI from 'pixi.js';
import { BOSS_BULLET_SPEED } from '../constants/contants';

export class BossBullet extends PIXI.Graphics {
    speed = BOSS_BULLET_SPEED;

    directionX = 0;
    directionY = 1;

    readonly widthHitbox = 6;
    readonly heightHitbox = 16;

    constructor(
        x: number,
        y: number,
        directionX = 0,
        directionY = 1
    ) {
        super();

        this.rect(-3, -8, 6, 16);
        this.fill(0x00ff00);

        this.x = x;
        this.y = y;

        this.directionX = directionX;
        this.directionY = directionY;
    }

    update(delta: number) {
        this.x += this.directionX * this.speed * delta;
        this.y += this.directionY * this.speed * delta;
    }
}