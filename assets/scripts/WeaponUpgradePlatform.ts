import { _decorator, BoxCollider, Component, ITriggerEvent } from 'cc';
import { PlayerUIController } from './UI/PlayerUIController';
const { ccclass, property } = _decorator;

@ccclass('WeaponUpgradePlatform')
export class WeaponUpgradePlatform extends Component {
    private collider: BoxCollider;

    protected onLoad(): void {
        this.collider = this.node.getComponent(BoxCollider);
    }

    protected start(): void {
        this.collider.on('onTriggerEnter', this.onTriggerEnter, this);
        this.collider.on('onTriggerExit', this.onTriggerExit, this);       
    }
    
    onTriggerEnter(event: ITriggerEvent) {
        //const collider = event.otherCollider;
        PlayerUIController.instance.WeaponUpgradeVisibility(true);
    }

    onTriggerExit(event: ITriggerEvent) {
        //const collider = event.otherCollider;
        PlayerUIController.instance.WeaponUpgradeVisibility(false);
    }

    protected onDestroy(): void {
        this.collider.off('onTriggerEnter', this.onTriggerEnter, this);
        this.collider.off('onTriggerExit', this.onTriggerExit, this);
    }
}
