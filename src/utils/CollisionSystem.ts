import * as PIXI from 'pixi.js';

type CollisionPair<T, U> = {
    first: T;
    second: U;
};

export class CollisionSystem {
    static checkGroupVsGroup<T extends PIXI.Container,U extends PIXI.Container>(groupA: T[],groupB: U[]): CollisionPair<T, U>[] {

        const collisions: CollisionPair<T, U>[] = [];

        for (const a of groupA) {
            for (const b of groupB) {
                if (this.intersects(a, b)) {
                    collisions.push({
                        first: a,
                        second: b,
                    });
                }
            }
        }

        return collisions;
    }

    private static intersects(a: PIXI.Container,b: PIXI.Container): boolean {
        const boundsA = a.getBounds();
        const boundsB = b.getBounds();

    if (boundsA.x + boundsA.width < boundsB.x) return false;
    if (boundsA.x > boundsB.x + boundsB.width) return false;
    if (boundsA.y + boundsA.height < boundsB.y) return false;
    if (boundsA.y > boundsB.y + boundsB.height) return false;
    
    return true;
    }
}