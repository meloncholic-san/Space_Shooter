import * as PIXI from 'pixi.js';
import { BaseScene } from '../scene/BaseScene';
import type { InputManager } from './InputManager';

export class SceneManager {
    private currentScene: BaseScene | null = null;

    constructor(
        private stage: PIXI.Container,
        private input: InputManager
    ) {}

    async changeScene(scene: BaseScene) {
        if (this.currentScene) {
            this.stage.removeChild(this.currentScene);
            this.currentScene.destroyScene();
            this.input.clear();
        }
        await scene.init(this.input);
        
        this.currentScene = scene;
        scene.setSceneManager(this);
        this.stage.addChild(scene);
    }

    update(delta: number) {
        this.currentScene?.update(delta);
    }
}