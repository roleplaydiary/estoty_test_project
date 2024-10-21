import { _decorator, Component, Node } from 'cc';
import { MapObjects } from './MapObjects';
const { ccclass, property } = _decorator;

@ccclass('ResourceController')
export class ResourceController extends Component {
    @property
        private resourceLevel: number = 1;
    private resourceHealth: number = 2;

    public resourceAttack(weaponLevel: number): boolean {
        if (weaponLevel >= this.resourceLevel) {
            this.resourceHealth -= 1;
            console.log(this.node.name + " получил урон. Осталось хп = " + this.resourceHealth);
            if (this.resourceHealth <= 0) {
                this.resourceDestroy();
                return true;
            }
        }
        return false;
    }

    private resourceDestroy() {
        console.log("Resource destroyed " + this.name);
        // Здесь можно добавить анимацию уничтожения
        MapObjects.instance.removeMapObject(this);
    }
}
