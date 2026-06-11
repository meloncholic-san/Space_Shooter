import * as PIXI from 'pixi.js';
import { InputManager } from '../utils/InputManager';
import type { SceneManager } from '../utils/SceneManager';

export abstract class BaseScene extends PIXI.Container {
    protected sceneManager!: SceneManager;

    abstract init(input: InputManager): Promise<void>

    abstract update(delta: number): void;

    abstract destroyScene(): void;

    public setSceneManager(sceneManager: SceneManager) {
        this.sceneManager = sceneManager;
    }
}