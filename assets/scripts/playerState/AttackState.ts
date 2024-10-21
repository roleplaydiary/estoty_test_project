import { PlayerState } from './PlayerState';
import { PlayerMovementController } from '../PlayerMovementController';
import { PlayerAttackController } from '../PlayerAttackController';
import { Vec3 } from 'cc';
import { MapObjects } from '../MapObjects';

export class AttackState extends PlayerState {
    private attackController: PlayerAttackController;

    constructor(player: PlayerMovementController, attackController: PlayerAttackController) {
        super(player);
        this.attackController = attackController;
    }

    enter() {
        this.player.animationController?.playAnimation('Armature.001|Armature.001|AXE');
        this.attackController.startAttack(this.handleAttack.bind(this));
    }

    update(deltaTime: number) {
        if (!this.attackController.IsAttacking) {
            this.player.changeState('idle');
        }
    }

    exit() {
        this.attackController.stopAttack();
    }

    private handleAttack() {
        const attackRadius = 2;
        const playerPosition = this.player.node.worldPosition;

        const allObjects = MapObjects.instance.getMapObjects();
        let anyDestroyed = false;

        allObjects.forEach((targetNode) => {
            if (targetNode.node !== this.player.node) {
                const distance = Vec3.distance(playerPosition, targetNode.node.worldPosition);
                if (distance <= attackRadius) {
                    const resourceController = targetNode;
                    if (resourceController) {
                        const isDestroyed = resourceController.resourceAttack(this.attackController.getWeaponLevel());
                        if (isDestroyed) {
                            anyDestroyed = true;
                        }
                    }
                }
            }
        });

        if (!anyDestroyed) {
            // Если остались живые ресурсы, проигрываем анимацию снова
            this.player.animationController?.playAnimation('Armature.001|Armature.001|AXE');
        } else {
            this.attackController.stopAttack(); // Если уничтожены, прекращаем атаку
        }
    }
}
