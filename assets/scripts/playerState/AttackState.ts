import { PlayerState } from './PlayerState';
import { PlayerMovementController } from '../PlayerMovementController';
import { PlayerAttackController } from '../PlayerAttackController';
import { Vec3 } from 'cc';
import { MapObjects } from '../MapObjects';
import { ResourceController } from '../ResourceController';

export class AttackState extends PlayerState {
    private attackController: PlayerAttackController;

    constructor(player: PlayerMovementController, attackController: PlayerAttackController) {
        super(player);
        this.attackController = attackController;
    }

    enter() {
        this.player.animationController?.playAnimation('Armature.001|Armature.001|AXE'); // Запускаем анимацию
        this.attackController.startAttack(this.handleAttack.bind(this)); // Передаем функцию для обработки атаки
    }

    update(deltaTime: number) {
        // Если атака завершена, переходим в состояние idle
        if (!this.attackController.IsAttacking) {
            this.player.changeState('idle');
        }

        // Дополнительные проверки для прекращения атаки
        if (this.shouldStopAttacking()) {
            this.player.changeState('idle');
        }
    }

    exit() {
        this.attackController.stopAttack(); // Останавливаем атаку
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

        if (anyDestroyed) {
            this.attackController.stopAttack(); // Останавливаем атаку, если кто-то уничтожен
        }
    }

    private shouldStopAttacking(): boolean {
        // Логика для прекращения атаки
        return false; // Замените это на вашу логику
    }
}
