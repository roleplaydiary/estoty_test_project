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

    private isAttacking: boolean = false;
    public get IsAttacking(): boolean {
        return this.isAttacking;
    }
    private mapObjects: ResourceController[] = [];

    protected onLoad(): void {
        this.mapObjectsInitialize();
    }

    private mapObjectsInitialize() {
        MapObjects.instance.getMapObjects().forEach(element => {
            this.mapObjects.push(element.getComponent(ResourceController));
        });
        
    }

    protected start(): void {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchStart() {
        this.weaponAttackStop();
    }

    onTouchEnd() {
        this.weaponAttackStart();
    }

    private weaponUpgrade(newWeaponLevel: number) {
        this.weaponLevel = newWeaponLevel;
    }

    public weaponAttackStart() {
        const attackRadius = 2;
        const playerPosition = this.node.worldPosition;

        this.mapObjects.forEach((targetNode) => {
            if (targetNode.node !== this.node) {
                const distance = Vec3.distance(playerPosition, targetNode.node.worldPosition);
                if (distance <= attackRadius) {
                    const resourceController = targetNode.getComponent(ResourceController);

                    if (resourceController) {
                        this.isAttacking = true;
                        resourceController.resourceAttack(this.weaponLevel);
                        this.animationController?.playAnimation('Armature.001|Armature.001|AXE');
                    }
                }
            }
        });
    }

    public weaponAttackStop() {
        this.isAttacking = false;
    }
}


