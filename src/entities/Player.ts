import * as PIXI from 'pixi.js';
import { PLAYER_SPEED, MAX_AMMO, GAME_WIDTH } from '../constants/contants';
import type { InputManager } from '../utils/InputManager';

export class Player extends PIXI.Sprite {
    speed = PLAYER_SPEED;
    ammo = MAX_AMMO;
    canShoot = true;

    constructor(texture: PIXI.Texture) {
        super(texture);
        this.anchor.set(0.5);
    }

    update(delta: number, input: InputManager) {
        if (input.isPressed('ArrowLeft')) {
            this.x -= this.speed * delta;
            this.rotation = -0.2;
        }

        if (input.isPressed('ArrowRight')) {
            this.x += this.speed * delta;
            this.rotation = 0.2;
        }

        this.clampToScreen();
    }

    private clampToScreen() {
        const halfWidth = this.width / 2;
        const leftBound = -GAME_WIDTH / 2 + halfWidth;
        const rightBound = GAME_WIDTH / 2 - halfWidth;
        
        if (this.x < leftBound) {
            this.x = leftBound;
        }
        
        if (this.x > rightBound) {
            this.x = rightBound;
        }
        
        this.rotation *= 0.9;
    }
}