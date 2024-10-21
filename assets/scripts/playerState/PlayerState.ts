import { PlayerMovementController } from "../PlayerMovementController";

export abstract class PlayerState {
    protected player: PlayerMovementController;
    
    constructor(player: PlayerMovementController) {
        this.player = player;
    }

    abstract enter(): void;
    abstract update(deltaTime: number): void;
    abstract exit(): void;
}
