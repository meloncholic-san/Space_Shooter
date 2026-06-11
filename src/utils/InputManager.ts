export class InputManager {
    private pressedKeys = new Set<string>();
    private justPressedKeys = new Set<string>();

    constructor() {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        if (!this.pressedKeys.has(event.code)) {
            this.justPressedKeys.add(event.code);
        }

        this.pressedKeys.add(event.code);
    };

    private handleKeyUp = (event: KeyboardEvent) => {
        this.pressedKeys.delete(event.code);
    };

    public isPressed(key: string): boolean {
        return this.pressedKeys.has(key);
    }

    public isJustPressed(key: string): boolean {
        return this.justPressedKeys.has(key);
    }

    public update() {
        this.justPressedKeys.clear();
    }
    
    public clear() {
        this.pressedKeys.clear();
        this.justPressedKeys.clear();
    }
}