import { _decorator, Component, Input, input } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerAttackController')
export class PlayerAttackController extends Component {
    private weaponLevel = 1;
    private isAttacking = false;
    private attackCooldown = 1.5;

    public get IsAttacking(): boolean {
        return this.isAttacking;
    }

    public startAttack(attackCallback: () => void) {
        if (this.isAttacking) return;
        this.isAttacking = true;

        const attackInterval = setInterval(() => {
            attackCallback();
        }, this.attackCooldown * 1000);

        const originalStop = this.stopAttack.bind(this);
        this.stopAttack = () => {
            clearInterval(attackInterval);
            originalStop();
        };
    }

    public stopAttack() {
        this.isAttacking = false;
    }

    public getWeaponLevel(): number {
        return this.weaponLevel;
    }
}
