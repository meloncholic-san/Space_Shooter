import * as PIXI from 'pixi.js';
import { BaseScene } from './BaseScene';
import { InputManager } from '../utils/InputManager';
import { Level1Scene } from './Level1Scene';

export class LoseScene extends BaseScene {
    private input!: InputManager;

    async init(input: InputManager) {
        this.input = input;

        const text = new PIXI.Text({
            text: 'YOU LOSE!',
            style: {
                fill: '#ff0000',
                fontSize: 80,
                fontWeight: 'bold',
            }
        });

        text.anchor.set(0.5);
        this.addChild(text);

        const hint = new PIXI.Text({
            text: 'Press Enter to Restart',
            style: {
                fill: '#ffffff',
                fontSize: 28,
            }
        });

        hint.anchor.set(0.5);
        hint.y = 120;

        this.addChild(hint);
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