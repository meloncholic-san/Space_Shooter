import * as PIXI from 'pixi.js';
import { GAME_HEIGHT, GAME_WIDTH } from '../constants/contants';

export const setSceneBackground = async (texturePath: string, stage: PIXI.Container) => {
    const texture = await PIXI.Assets.load(texturePath);
    const background = new PIXI.Sprite(texture);
    background.width = GAME_WIDTH;
    background.height = GAME_HEIGHT;
    background.position.set(-GAME_WIDTH / 2, -GAME_HEIGHT / 2);
    background.zIndex = -1;
    stage.addChildAt(background, 0);
    return background;
}