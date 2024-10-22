import { _decorator, Component, Node } from 'cc';
import { MapObjects } from './MapObjects';
import { ResourceAnimationController } from './ResourceAnimationController';
import { PlayerInventory } from './PlayerInventory';
import { Resource } from './Resource';
import { PlayerMovementController } from './PlayerMovementController';
const { ccclass, property } = _decorator;


@ccclass('ResourceController')
export class ResourceController extends Component {
    @property
        private resourceLevel: number = 1;

    @property
        private resourceHealth: number = 5;

    @property({ type: [Resource] })
        private resources: Resource[] = [];

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
        console.log("Resource destroyed " + this.node.name);
        this.animationController?.playDisappearAnimation(this.node);
        this.addResourcesToPlayer();
        MapObjects.instance.removeMapObject(this);
    }

    private playHitAnimation() {
        if (this.animationController) {
            this.animationController.playHitAnimation(this.node);
        }
    }

    private addResourcesToPlayer() {
        const playerInventory = this.getPlayerInventory();
        if (playerInventory) {
            this.resources.forEach(resource => {
                playerInventory.addResource(resource.id, resource.quantity);
                console.log(`Player получил ресурс ID: ${resource.id}, Количество: ${resource.quantity}`);
            });
        }
    }

    private getPlayerInventory(): PlayerInventory | null {
        const playerNode = this.getPlayerNode();
        if (playerNode) {
            return playerNode.getComponent(PlayerInventory);
        }
        return null;
    }

    private getPlayerNode(): Node | null {
        const playerNode = PlayerMovementController.instance.node; 
        return playerNode;
    }

    public getResourceHealth(): number {
        return this.resourceHealth;
    }
}
