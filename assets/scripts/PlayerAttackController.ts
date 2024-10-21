import { _decorator, Component, Input, input, Vec3} from 'cc';
import { AnimationController } from './AnimationController';
import { ResourceController } from './ResourceController';
import { MapObjects } from './MapObjects';
const { ccclass, property } = _decorator;

@ccclass('PlayerAttackController')
export class PlayerAttackController extends Component {

    private weaponLevel: number = 1;
    @property(AnimationController)
    private animationController: AnimationController | null = null;

    protected start(): void {
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchEnd() {
        this.weaponAttack();
    }

    private weaponUpgrade(newWeaponLevel: number) {
        this.weaponLevel = newWeaponLevel;
    }

    private weaponAttack() {
        const attackRadius = 2;
        const playerPosition = this.node.worldPosition;
    
        const allObjects = MapObjects.instance.getMapObjects();

        allObjects.forEach((targetNode) => {
            if (targetNode !== this.node) {
                const distance = Vec3.distance(playerPosition, targetNode.worldPosition);
                if (distance <= attackRadius) {
                    const resourceController = targetNode.getComponent(ResourceController);

                    if (resourceController) {
                        resourceController.resourceAttack(this.weaponLevel);
                        this.animationController?.playAnimation('Armature.001|Armature.001|AXE');
                    }
                }
            }
        });
    }
    
}


