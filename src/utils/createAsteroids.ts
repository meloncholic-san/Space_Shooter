import * as PIXI from 'pixi.js';
import { Asteroid } from '../entities/Asteroid';
import { GAME_WIDTH, GAME_HEIGHT } from '../constants/contants';
import type { BaseScene } from '../scene/BaseScene';

export class CreateAsteroids {
    private asteroids: Asteroid[] = [];

    constructor(private stage: BaseScene) {}

    public spawnBatch(count: number, textures: PIXI.Texture[]) {
        for (let i = 0; i < count; i++) {
            const asteroid = this.spawnOne(textures);
            this.asteroids.push(asteroid);
            this.stage.addChild(asteroid);
        }

        return this.asteroids;
    }

    private spawnOne(textures: PIXI.Texture[]): Asteroid {
        let asteroid!: Asteroid;
        let valid = false;

        while (!valid) {
            const texture =
                textures[Math.floor(Math.random() * textures.length)];

            asteroid = new Asteroid(texture);

            asteroid.anchor.set(0.5);

            asteroid.x = this.random(
                (-GAME_WIDTH / 2 + asteroid.width / 2) + 20,
                (GAME_WIDTH / 2 - asteroid.width / 2) - 20
            );

            asteroid.y = this.random(
                (-GAME_HEIGHT / 2 + asteroid.height / 2) + 50,
                -50 - asteroid.height / 2                
            );

            valid = !this.isOverlapping(asteroid);
        }

        return asteroid;
    }

    private isOverlapping(newAsteroid: Asteroid): boolean {
        return this.asteroids.some(existing => {
            const dx = newAsteroid.x - existing.x;
            const dy = newAsteroid.y - existing.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            const minDistance =
                newAsteroid.width / 2 +
                existing.width / 2 +
                20;

            return distance < minDistance;
        });
    }

    private random(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    public getAsteroids() {
        return this.asteroids;
    }
}