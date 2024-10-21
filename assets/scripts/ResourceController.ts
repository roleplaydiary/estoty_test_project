import { _decorator, Component, Node } from 'cc';
import { MapObjects } from './MapObjects';
import { ResourceAnimationController } from './ResourceAnimationController'; // Импортируем новый класс
const { ccclass, property } = _decorator;

@ccclass('ResourceController')
export class ResourceController extends Component {
    @property
        private resourceLevel: number = 1;
    @property
        private resourceHealth: number = 5;

    private animationController: ResourceAnimationController | null = null;

    protected onLoad() {
        this.animationController = this.getComponent(ResourceAnimationController);
    }

    public resourceAttack(weaponLevel: number): boolean {
        if (weaponLevel >= this.resourceLevel) {
            this.resourceHealth -= 1;
            console.log(this.node.name + " получил урон. Осталось хп = " + this.resourceHealth);
            if (this.resourceHealth <= 0) {
                this.resourceDestroy();
                return true;
            }

            this.playHitAnimation();
        }
        return false;
    }

    private resourceDestroy() {
        console.log("Resource destroyed " + this.name);
        this.animationController.playDisappearAnimation(this.node);
        MapObjects.instance.removeMapObject(this);
    }

    private playHitAnimation() {
        if (this.animationController) {
            this.animationController.playHitAnimation(this.node);
        }
    }

    public getResourceHealth(): number{
        return this.resourceHealth;
    }
}
