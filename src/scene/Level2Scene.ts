import { Boss } from '../entities/Boss';
import { BaseScene } from './BaseScene';
import * as PIXI from 'pixi.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../constants/contants';
import { Player } from '../entities/Player';
import { InputManager } from '../utils/InputManager';
import { Bullet } from '../entities/Bullet';
import { setSceneBackground } from '../utils/setBackground';
import { BossBullet} from '../entities/BossBullet';
import { CollisionSystem } from '../utils/CollisionSystem';
import { LoseScene } from './LoseScene';
import { WinScene } from './WinScene';
import { loadAsset} from '../utils/loadAsset'

export class Level2Scene extends BaseScene {
    private boss!: Boss;
    private player!: Player;
    private bullets: Bullet[] = [];
    private bossBullets: BossBullet[] = [];
    private input!: InputManager;
    private bossShootTimer = 0;
    private attackInterval = 2;
    private gameEnded = false;
    private remainingTime = 60;
    private timerText!: PIXI.Text;
    private ammoText!: PIXI.Text;

    async init(input: InputManager) {
        //background
        await setSceneBackground('/space_background2.png', this);
        //boss
        const [bossTexture, damage1Texture, damage2Texture] = 
            await Promise.all([loadAsset('/shipGreen_manned.png'),loadAsset('/shipGreen_damage1.png'),loadAsset('/shipGreen_damage2.png')]);

        this.boss = new Boss(bossTexture, damage1Texture, damage2Texture);
        this.boss.y = -GAME_HEIGHT / 2 + 100;
        this.addChild(this.boss);

        //player 
        this.input = input;
        const playerTexture = await loadAsset('./playerShip1_red.png');
        console.log('Player texture loaded:', playerTexture);

        this.player = new Player(playerTexture);
        this.player.y = 300;

        this.addChild(this.player);
        //UI
        this.createTimerText();
        this.createAmmoText();
        
    }

    update(delta: number) {
        //ticker for boss movement
        this.boss.update(delta);
        //ticker for player movement and shooting
        this.player.update(delta, this.input);
        if (this.input.isJustPressed('Space')) {
            this.shoot();
        }
        //ticker for boss shooting
        this.bossShootTimer += delta / 60;
        if (this.bossShootTimer >= this.attackInterval) {
            this.bossShootTimer = 0;
            this.handleBossAttack();
        }

        //ticker for bullets movement
        this.updateBullets(delta);
        this.updateBossBullets(delta);
        //ticker for collisions
        this.handleCollisions();

        //ticker for timer and ammo ui
        this.remainingTime -= delta / 60;
        this.timerText.text =`TIME: ${Math.ceil(this.remainingTime)}`;
        this.ammoText.text =`AMMO: ${this.player.ammo}/10`;
        //ticker for lose condition
        if (this.remainingTime <= 0 && this.boss.hp > 0 && !this.gameEnded) {
            this.gameEnded = true;
            this.sceneManager?.changeScene(new LoseScene());
            return;
        }
        this.checkLoseCondition();


    }

    destroyScene() {
        this.destroy({ children: true });
    }

    private shoot() {
        if (this.player.ammo <= 0) {
            return;
        }

        this.player.ammo--;

        const bullet = new Bullet(
            this.player.x,
            this.player.y - 30
        );

        this.bullets.push(bullet);
        this.addChild(bullet);
    }

    private bossBasicAttack() {
        const bullet = new BossBullet(
            this.boss.x,
            this.boss.y + 50,
            0,
            1
        );

        this.bossBullets.push(bullet);
        this.addChild(bullet);
    }

    private bossTripleAttack() {
        const angles = [0, -15, 15];

        for (const angle of angles) {
            const rad = (angle * Math.PI) / 180;
            //обернене триганометричне коло, головна вісь - це вісь Y, тому синус відповідає за X, а косинус за Y
            const dx = Math.sin(rad);
            const dy = Math.cos(rad);

            const bullet = new BossBullet(
                this.boss.x,
                this.boss.y + 50,
                dx,
                dy
            );

            this.bossBullets.push(bullet);
            this.addChild(bullet);
        }
    }

    private bossSpreadAttack5() {
        const baseAngles = [-60, -30, 0, 30, 60];

        for (const angle of baseAngles) {
            const rad = (angle * Math.PI) / 180;

            const dx = Math.sin(rad);
            const dy = Math.cos(rad);

            const bullet = new BossBullet(
                this.boss.x,
                this.boss.y + 50,
                dx,
                dy
            );

            this.bossBullets.push(bullet);
            this.addChild(bullet);
        }
    }

    private handleBossAttack() {
        if (this.boss.hp >= 3) {
            this.bossBasicAttack();
        } else if (this.boss.hp >= 2) {
            this.bossTripleAttack();
        } else {
            this.bossSpreadAttack5();
        }
    }

    private updateBullets(delta: number) {
        const aliveBullets: Bullet[] = [];

        for (const bullet of this.bullets) {
            bullet.update(delta);

            if (bullet.y < -GAME_HEIGHT / 2 - 50) {
                this.removeChild(bullet);
                bullet.destroy();
            } else {
                aliveBullets.push(bullet);
            }
        }

        this.bullets = aliveBullets;
    }

    private updateBossBullets(delta: number) {
        const alive: BossBullet[] = [];

        for (const b of this.bossBullets) {
            b.update(delta);

            if (
                b.y > GAME_HEIGHT / 2 + 50 ||
                b.x < -GAME_WIDTH / 2 - 50 ||
                b.x > GAME_WIDTH / 2 + 50
            ) {
                this.removeChild(b);
                b.destroy();
            } else {
                alive.push(b);
            }
        }

        this.bossBullets = alive;
    }

    private handleCollisions() {
    // 1. PLAYER BULLETS vs BOSS
        const bossHits = CollisionSystem.checkGroupVsGroup(
            this.bullets,
            [this.boss]
        );

        for (const hit of bossHits) {
            const bullet = hit.first;

            this.removeChild(bullet);
            bullet.destroy();

            this.bullets = this.bullets.filter(b => b !== bullet);

            this.boss.takeDamage();

            if (this.boss.hp <= 0 && !this.gameEnded) {
                this.gameEnded = true;
                this.sceneManager?.changeScene(new WinScene());
                return;
            }
        }

        // 2. BOSS BULLETS vs PLAYER
        const playerHits = CollisionSystem.checkGroupVsGroup(
            this.bossBullets,
            [this.player]
        );

        for (const _ of playerHits) {
            this.sceneManager?.changeScene(new LoseScene());
            return;
        }

        // 3. BULLETS vs BULLETS
        const bulletCollisions = CollisionSystem.checkGroupVsGroup(
            this.bullets,
            this.bossBullets
        );

        for (const hit of bulletCollisions) {
            const b1 = hit.first;
            const b2 = hit.second;

            this.removeChild(b1);
            this.removeChild(b2);

            b1.destroy();
            b2.destroy();

            this.bullets = this.bullets.filter(b => b !== b1);
            this.bossBullets = this.bossBullets.filter(b => b !== b2);
        }
    }

    private createTimerText() {
        this.timerText = new PIXI.Text({
            text: 'TIME: 60',
            style: {
                fill: '#ffffff',
                fontSize: 24,
                fontWeight: 'bold',
            },
        });

        this.timerText.position.set(
            -GAME_WIDTH / 2 + 20,
            -GAME_HEIGHT / 2 + 10
        );

        this.addChild(this.timerText);
    }

    private createAmmoText() {
        this.ammoText = new PIXI.Text({
            text: `AMMO: ${this.player.ammo}/10`,
            style: {
                fill: '#ffffff',
                fontSize: 24,
                fontWeight: 'bold',
            },
        });

        this.ammoText.position.set(
            GAME_WIDTH / 2 - this.ammoText.width - 20,
            -GAME_HEIGHT / 2 + 10
        );

        this.addChild(this.ammoText);
    }

    private checkLoseCondition() {
        const noAmmo = this.player.ammo <= 0;
        const noBulletsOnScreen = this.bullets.length === 0;
        const bossAlive = this.boss.hp > 0;

        if (noAmmo && noBulletsOnScreen && bossAlive && !this.gameEnded) {
            this.gameEnded = true;
            this.sceneManager?.changeScene(new LoseScene());
        }
    }
}