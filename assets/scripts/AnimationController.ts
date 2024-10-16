import { _decorator, Component, Node, SkeletalAnimation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AnimationController')
export class AnimationController extends Component {
    @property(SkeletalAnimation)
    skeletalAnimation: SkeletalAnimation | null = null; // Ссылка на SkeletalAnimation

    private currentAnimation: string = 'Armature.001|Armature.001|IDLE'; // Имя анимации по умолчанию

    start() {
        if (this.skeletalAnimation) {
            this.playAnimation(this.currentAnimation); // Запуск анимации по умолчанию
        }
    }

    playAnimation(animationName: string) {
        if (this.skeletalAnimation && this.currentAnimation !== animationName) {
            this.currentAnimation = animationName;

            // Воспроизводим анимацию по имени
            this.skeletalAnimation.play(animationName);
        }
    }

    stopAnimation() {
        // Здесь можно добавить логику для остановки анимации, если это нужно
    }
}
