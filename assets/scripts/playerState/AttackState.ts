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
        const attackRadius = 1.5;
        const playerPosition = this.player.node.worldPosition;

        // Наносим урон всем ресурсам в радиусе атаки
        const anyDestroyed = this.attackAllNearbyResources(playerPosition, attackRadius);

        if (anyDestroyed) {
            // Если остались живые ресурсы, продолжаем атаку
            if (this.hasAliveTargets(playerPosition, attackRadius)) {
                this.player.animationController?.playAnimation('Armature.001|Armature.001|AXE');
            } else {
                // Если все ресурсы уничтожены, останавливаем атаку
                this.attackController.stopAttack();
            }
        } else {
            // Если ни один ресурс не был атакован, повторяем анимацию
            this.player.animationController?.playAnimation('Armature.001|Armature.001|AXE');
        }
    }

    private attackAllNearbyResources(playerPosition: Vec3, attackRadius: number): boolean {
        const allObjects = MapObjects.instance.getMapObjects();
        let anyDestroyed = false;

        for (const targetNode of allObjects) {
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
        }

        return anyDestroyed;
    }

    private hasAliveTargets(playerPosition: Vec3, attackRadius: number): boolean {
        const allObjects = MapObjects.instance.getMapObjects();

        for (const targetNode of allObjects) {
            if (targetNode.node !== this.player.node) {
                const distance = Vec3.distance(playerPosition, targetNode.node.worldPosition);
                if (distance <= attackRadius) {
                    const resourceController = targetNode;
                    if (resourceController && resourceController.getResourceHealth() > 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
