import { PlayerState } from './PlayerState';

export class IdleState extends PlayerState {
    enter() {
        this.player.animationController?.playAnimation('Armature.001|Armature.001|IDLE');
    }

    update(deltaTime: number) {
        // Ничего не делаем, просто ожидаем.
    }

    exit() {
        // Ничего не делаем при выходе из состояния.
    }
}
