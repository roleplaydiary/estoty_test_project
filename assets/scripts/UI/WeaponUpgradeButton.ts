import { _decorator, Component} from 'cc';
import { PlayerInventory } from '../PlayerInventory';
import { PlayerMovementController } from '../PlayerMovementController';
import { PlayerAttackController } from '../PlayerAttackController';
import { Resource } from '../Resource';

const { ccclass, property} = _decorator;

@ccclass('WeaponUpgradeButton')
export class WeaponUpgradeButton extends Component {
    @property({ type: [Resource] })
        upgradeRequirements: Resource[] = [];

    private onWeaponUpgradeButtonPressed() {
        let playerAttackController = PlayerMovementController.instance.node.getComponent(PlayerAttackController);

        let currentWeaponLevel = playerAttackController.getWeaponLevel();
        if (currentWeaponLevel < this.upgradeRequirements.length) {
            let playerInventory = PlayerMovementController.instance.node.getComponent(PlayerInventory);
            const requirement = this.upgradeRequirements[currentWeaponLevel - 1];

            if (playerInventory.checkResource(requirement.id) >= requirement.quantity) {
                
                playerAttackController.upgradeWeaponLevel();
                playerInventory.removeResource(requirement.id, requirement.quantity);
                console.log(`Weapon upgraded to level ${playerAttackController.getWeaponLevel()}`);
            } else {
                console.log("Resources are not enough");
            }
        } else {
            console.log("Maximum upgrade level reached = " + currentWeaponLevel);
        }
    }
}
