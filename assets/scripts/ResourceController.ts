import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ResourceController')
export class ResourceController extends Component {
    private resourceLevel: number = 1;

    public resourceAttack(weaponLevel: number){
        if(weaponLevel >= this.resourceLevel) {
            this.resourceDestroy();
        }
    }

    private resourceDestroy() {
        console.log("Resource destroyed " + this.name);
        // Play animation
    }
}


