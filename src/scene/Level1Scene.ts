import { BaseScene } from './BaseScene';
import { Player } from '../entities/Player';
import { Bullet } from '../entities/Bullet';
import * as PIXI from 'pixi.js';
import { InputManager } from '../utils/InputManager';
import { Asteroid } from '../entities/Asteroid';
import { CreateAsteroids } from '../utils/createAsteroids';
import { CollisionSystem } from '../utils/CollisionSystem';
import { GAME_WIDTH, GAME_HEIGHT } from '../constants/contants';
import { LoseScene } from './LoseScene';
import { Level2Scene } from './Level2Scene';


export class Level1Scene extends BaseScene {
    private player!: Player;
    private bullets: Bullet[] = [];
    private input!: InputManager;
    private asteroids: Asteroid[] = [];
    private spawner!: CreateAsteroids;
    private remainingTime = 60;
    private timerText!: PIXI.Text;
    private ammoText!: PIXI.Text;
    private gameEnded = false;

    async init(input: InputManager) {
        //player
        this.input = input;
        const playerTexture = await PIXI.Assets.load('./playerShip1_red.png');
        console.log('Player texture loaded:', playerTexture);

        this.player = new Player(
            playerTexture
        );
        this.player.y = 300;

        this.addChild(this.player);
        //asteroids
        const asteroidTextures = await Promise.all([
            PIXI.Assets.load('./meteorBrown_big4.png'),
            PIXI.Assets.load('./meteorBrown_med1.png'),
            PIXI.Assets.load('./meteorBrown_big1.png'),
            PIXI.Assets.load('./meteorGrey_big1.png'),
            PIXI.Assets.load('./meteorGrey_med1.png'),
        ]);
        console.log('Asteroids textures loaded:', asteroidTextures);

        this.spawner = new CreateAsteroids(this);
        this.asteroids = this.spawner.spawnBatch(6, asteroidTextures);

        this.creteTimerText();
        this.createAmmoText();

    }

    async update(delta: number) {
        //ticker for player movement and shooting
        this.player.update(delta, this.input);

        if (this.input.isJustPressed('Space')) {
            this.shoot();
        }
        //ticker for bullets movement
        this.updateBullets(delta);
        //ticker for asteroids collision
        const collisions = CollisionSystem.checkGroupVsGroup(this.bullets,this.asteroids);
        console.log('Collisions detected:', collisions.length);

        const bulletsToDestroy = new Set<Bullet>();
        const asteroidsToDestroy = new Set<Asteroid>();

        for (const collision of collisions) {
            bulletsToDestroy.add(collision.first);
            asteroidsToDestroy.add(collision.second);
        }

        for (const bullet of bulletsToDestroy) {
            this.removeChild(bullet);
            bullet.destroy();
        }

        for (const asteroid of asteroidsToDestroy) {
            this.removeChild(asteroid);
            asteroid.destroy();
        }

        this.bullets = this.bullets.filter(
            bullet => !bulletsToDestroy.has(bullet)
        );

        this.asteroids = this.asteroids.filter(
            asteroid => !asteroidsToDestroy.has(asteroid)
        );

        //ticker for remaining time and ammo
        this.remainingTime -= delta / 60;
        this.timerText.text =`TIME: ${Math.ceil(this.remainingTime)}`;
        if (this.remainingTime <= 0) {
            if (this.gameEnded) return;
                this.gameEnded = true;
                await this.sceneManager.changeScene(new LoseScene());
        }
        this.ammoText.text =`AMMO: ${this.player.ammo}/10`;
        //ticker for lose and win conditions
        this.checkLoseCondition();
        this.checkWinCondition();
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

    private  creteTimerText() {
        this.timerText = new PIXI.Text({
        text: 'TIME: 60',
        style: {
            fill: '#ffffff',
            fontSize: 24,
            fontWeight: 'bold',
        },
        });

        this.timerText.position.set(-GAME_WIDTH / 2 + 20, -GAME_HEIGHT / 2 + 10);
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

        this.ammoText.position.set(GAME_WIDTH / 2 -this.ammoText.width - 20, -GAME_HEIGHT / 2 + 10);
        this.addChild(this.ammoText);
    }

    private async checkLoseCondition() {
    const noAmmo = this.player.ammo <= 0;
    const noBulletsOnScreen = this.bullets.length === 0;
    const asteroidsRemain = this.asteroids.length > 0;

    if (
        noAmmo &&
        noBulletsOnScreen &&
        asteroidsRemain
    ) {
        if (this.gameEnded) return;
        this.gameEnded = true;
        await this.sceneManager.changeScene(new LoseScene());
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

    private checkWinCondition() {
        if (this.asteroids.length === 0 && !this.gameEnded) {
            this.gameEnded = true;
            this.sceneManager?.changeScene(new Level2Scene());
        }
    }

}