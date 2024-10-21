import { PlayerState } from './PlayerState';

export class RunState extends PlayerState {
    enter() {
        this.player.animationController?.playAnimation('Armature.001|Armature.001|RUN');
    }

    update(deltaTime: number) {
        let moveOffset = this.player.direction.clone().normalize().multiplyScalar(this.player.moveSpeed * deltaTime);
        this.player.node.setPosition(this.player.node.position.add(moveOffset));

        this.player.rotateCharacter();

        if (this.player.direction.length() === 0) { 
            this.player.changeState('idle');
        }
    }

    exit() {
        
    }
}
