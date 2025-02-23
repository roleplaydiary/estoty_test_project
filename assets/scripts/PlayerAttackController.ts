import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerAttackController')
export class PlayerAttackController extends Component {
    @property
        private weaponLevel = 1;
        
    private isAttacking = false;
    private attackCallback: (() => void) | null = null;

    public get IsAttacking(): boolean {
        return this.isAttacking;
    }

    public startAttack(callback: () => void) {
        if (this.isAttacking) return;
        this.isAttacking = true;
        this.attackCallback = callback;
    }

    public stopAttack() {
        this.isAttacking = false;
        this.attackCallback = null;
    }

    public getWeaponLevel(): number {
        return this.weaponLevel;
    }

    public onCharacterHit() {
        if (this.isAttacking && this.attackCallback) {
            this.attackCallback();
        }
    }

    public upgradeWeaponLevel() {
        this.weaponLevel ++;
        console.log("Weapon has been upgraded to level " + this.weaponLevel);
    }
}
