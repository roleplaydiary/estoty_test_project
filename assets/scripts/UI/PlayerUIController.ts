import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerUIController')
export class PlayerUIController extends Component {
    private static _instance: PlayerUIController;

    @property(Node)
        weaponUpgradeUI: Node;

    public static get instance(): PlayerUIController {
        return this._instance;
    }

    onLoad() {
        if (PlayerUIController._instance) {
            console.error("Multiple instances of PlayerUIController detected!");
            return;
        }
        PlayerUIController._instance = this;
    }

    protected start(): void {
        this.WeaponUpgradeVisibility(false);
    }

    public WeaponUpgradeVisibility(isVisible: boolean) {
        this.weaponUpgradeUI.active = isVisible;
    }

    onDestroy() {
        if (PlayerUIController._instance === this) {
            PlayerUIController._instance = null;
        }
    }
}
