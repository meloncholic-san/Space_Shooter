import * as PIXI from 'pixi.js';
import { GAME_WIDTH, GAME_HEIGHT } from './constants/contants'
import { setSceneBackground } from './utils/setBackground';
import './style.css'
import { InputManager } from './utils/InputManager';
import { SceneManager } from './utils/SceneManager';
import { Level1Scene } from './scene/Level1Scene';
// import { Level2Scene } from './scene/Level2Scene';

const app = new PIXI.Application();

await app.init({
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: 0x000000,
    antialias: true,
    resolution: 1,
    preference: 'webgl',
});
document.body.appendChild(app.canvas);
app.stage.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 2);



const RunGame = async () => {
    await setSceneBackground('/space_background.png', app.stage);
    const input = new InputManager();
    const sceneManager = new SceneManager(app.stage, input);
    await sceneManager.changeScene(new Level1Scene());

    app.ticker.add((ticker) => {
      sceneManager.update(ticker.deltaTime);
      input.update();
    });
}

RunGame();