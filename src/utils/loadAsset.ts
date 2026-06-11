import * as PIXI from 'pixi.js';

export const loadAsset = async (assetPath: string) => {
    const clean = assetPath.replace(/^(?:\.\/|\/)+/, '');
    const full = `${import.meta.env.BASE_URL}${clean}`;
    return PIXI.Assets.load(full);
}
