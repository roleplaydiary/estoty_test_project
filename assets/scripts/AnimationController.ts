import { _decorator, Component, Node, SkeletalAnimation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AnimationController')
export class AnimationController extends Component {
    @property(SkeletalAnimation)
        skeletalAnimation: SkeletalAnimation | null = null;

    private currentAnimation: string = 'Armature.001|Armature.001|IDLE';

    start() {
        if (this.skeletalAnimation) {
            this.playAnimation(this.currentAnimation);
        }
    }

    playAnimation(animationName: string) {
        if (this.skeletalAnimation && this.currentAnimation !== animationName) {
            this.currentAnimation = animationName;

            this.skeletalAnimation.play(animationName);
        }
    }

    stopAnimation() {
        
    }
}
