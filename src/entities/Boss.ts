import * as PIXI from 'pixi.js';
import { BOSS_HP, BOSS_SPEED } from '../constants/contants';

enum BossState {
    IDLE,
    MOVE,
}

export class Boss extends PIXI.Container {
    hp = BOSS_HP;
    readonly maxHp = BOSS_HP;
    private state = BossState.IDLE;
    private stateTimer = 0;
    private direction = 1;
    private speed = BOSS_SPEED;
    private base!: PIXI.Sprite;
    private damage1!: PIXI.Sprite;
    private damage2!: PIXI.Sprite;
    private hpBarBg!: PIXI.Graphics;
    private hpBarFill!: PIXI.Graphics;

    constructor(baseTexture: PIXI.Texture,damage1Texture: PIXI.Texture,damage2Texture: PIXI.Texture) {
        super();
        this.base = new PIXI.Sprite(baseTexture);

        this.damage1 = new PIXI.Sprite(damage1Texture);
        this.damage2 = new PIXI.Sprite(damage2Texture);

        this.base.anchor.set(0.5);
        this.damage1.anchor.set(0.5);
        this.damage2.anchor.set(0.5);
        this.damage1.y = 30;
        this.damage2.y = 30;

        this.damage1.visible = false;
        this.damage2.visible = false;

        this.addChild(this.base);
        this.addChild(this.damage1);
        this.addChild(this.damage2);

        this.createHpBar();

    }

    update(delta: number) {
        this.stateTimer += delta / 60;

        if (this.state === BossState.IDLE) {
            if (this.stateTimer >= 2) {
                this.state = BossState.MOVE;
                this.stateTimer = 0;
            }
        }

        else {
            this.x += this.speed * this.direction * delta;

            if (this.x > 400) {
                this.direction = -1;
            }

            if (this.x < -400) {
                this.direction = 1;
            }

            if (this.stateTimer >= 3) {
                this.state = BossState.IDLE;
                this.stateTimer = 0;
            }
        }
    }

    takeDamage() {
        this.hp--;

        this.alpha = 0.5;
        setTimeout(() => {
            this.alpha = 1;
        }, 100);//can also add invinsibality frames by basic setTimeout but for now just a flash effect! 

        this.updateDamageState();
        this.updateHpBar();
    }

    private updateDamageState() {
        if (this.hp <= 3) {
            
            this.damage1.visible = true;
        }

        if (this.hp <= 2) {
            this.damage1.visible = false;
            this.damage2.visible = true;
        }
    }

    private createHpBar() {
        this.hpBarBg = new PIXI.Graphics();

        this.hpBarBg
            .roundRect(-60, -70, 120, 12, 6)
            .fill(0x222222);

        this.hpBarFill = new PIXI.Graphics();

        this.hpBarFill
            .roundRect(-58, -68, 116, 8, 4)
            .fill(0x00ff00);

        this.addChild(this.hpBarBg);
        this.addChild(this.hpBarFill);
        this.hpBarBg.y = -10;
        this.hpBarFill.y = -10;
    }

    private updateHpBar() {
        const percent = this.hp / this.maxHp;

        this.hpBarFill.clear();

        let color = 0x00ff00;

        if (percent <= 0.5) {
            color = 0xffff00;
        }

        if (percent <= 0.25) {
            color = 0xff0000;
        }

        this.hpBarFill
            .roundRect(
                -58,
                -68,
                116 * percent,
                8,
                4
            )
            .fill(color);
    }
}