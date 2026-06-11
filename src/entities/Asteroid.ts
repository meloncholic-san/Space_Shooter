import * as PIXI from 'pixi.js';

export class Asteroid extends PIXI.Sprite {
    constructor(texture: PIXI.Texture) {
        super(texture);

        this.anchor.set(0.5);
    }
    update(delta:number) {
        this.y += Math.sin(this.x * 0.01) * delta;//TODO
    }
}