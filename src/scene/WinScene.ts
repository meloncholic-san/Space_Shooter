import * as PIXI from 'pixi.js';
import { BaseScene } from './BaseScene';
import { InputManager } from '../utils/InputManager';
import { Level1Scene } from './Level1Scene';

export class WinScene extends BaseScene {
    private input!: InputManager;

    async init(input: InputManager) {
        this.input = input;

        const title = new PIXI.Text({
            text: 'YOU WIN!',
            style: {
                fill: '#00ff00',
                fontSize: 80,
                fontWeight: 'bold',
            }
        });

        title.anchor.set(0.5);
        title.y = -50;

        const restartText = new PIXI.Text({
            text: 'Press ENTER to Restart',
            style: {
                fill: '#ffffff',
                fontSize: 32,
            }
        });

        restartText.anchor.set(0.5);
        restartText.y = 50;

        this.addChild(title);
        this.addChild(restartText);
    }

    update() {
        if (this.input.isJustPressed('Enter')) {
            this.sceneManager?.changeScene(new Level1Scene());
        }
    }

    destroyScene() {
        this.destroy({ children: true });
    }
}