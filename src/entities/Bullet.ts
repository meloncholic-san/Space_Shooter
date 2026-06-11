import * as PIXI from 'pixi.js';
import { BULLET_SPEED } from '../constants/contants';

export class Bullet extends PIXI.Graphics {
    speed = BULLET_SPEED;
    readonly widthHitbox = 6;
    readonly heightHitbox = 16;

    constructor(x: number, y: number) {
        super();

        this.rect(-3, -8, 6, 16);
        this.fill(0xff0000);

        this.x = x;
        this.y = y;
    }

    update(delta: number) {
        this.y -= this.speed * delta;
    }
}