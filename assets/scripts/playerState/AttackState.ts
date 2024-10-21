import { PlayerState } from './PlayerState';
import { PlayerMovementController } from '../PlayerMovementController';
import { PlayerAttackController } from '../PlayerAttackController';

export class AttackState extends PlayerState {
    private attackController: PlayerAttackController;

    constructor(player: PlayerMovementController, attackController: PlayerAttackController) {
        super(player);
        this.attackController = attackController;
    }

    enter() {
        this.player.animationController?.playAnimation('Armature.001|Armature.001|AXE');
        this.attackController.weaponAttackStart();
    }

    update(deltaTime: number) {
        // Во время атаки можно добавить логику (например, если атака завершена)
        if (!this.attackController.IsAttacking) {
            this.player.changeState('idle');
        }
    }

    exit() {
        this.attackController.weaponAttackStop();
    }
}
