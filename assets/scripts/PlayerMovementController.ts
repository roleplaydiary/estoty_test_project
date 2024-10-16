import { _decorator, Component, Node, SkeletalAnimation, Vec3, input, Input, KeyCode, EventKeyboard } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerMovementController')
export class PlayerMovementController extends Component {
    @property
    moveSpeed: number = 200; // Скорость передвижения персонажа

    private anim: SkeletalAnimation | null = null;
    private isMoving: boolean = false;
    private currentAnimation: string = 'Armature.001|Armature.001|IDLE.animation';

    private direction: Vec3 = new Vec3(0, 0, 0);
    private velocity: Vec3 = new Vec3(0, 0, 0); // Скорость движения

    start() {
        // Получаем компонент SkeletalAnimation
        this.anim = this.node.getComponent(SkeletalAnimation);

        // Устанавливаем анимацию по умолчанию как IDLE
        if (this.anim) {
            this.anim.play(this.currentAnimation);
        }

        // Настройка событий для управления с клавиатуры
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    update(deltaTime: number) {
        // Если есть движение, переключаем на анимацию RUN
        if (this.velocity.length() > 0) {
            if (!this.isMoving) {
                this.playAnimation('Armature.001|Armature.001|RUN.animation');
                this.isMoving = true;
            }
        } else {
            // Если движения нет, переключаем на анимацию IDLE
            if (this.isMoving) {
                this.playAnimation('Armature.001|Armature.001|IDLE.animation');
                this.isMoving = false;
            }
        }

        // Движение персонажа
        let moveOffset = this.velocity.clone().multiplyScalar(this.moveSpeed * deltaTime);
        this.node.setPosition(this.node.position.add(moveOffset));
    }

    // Обработчик нажатия клавиш
    private onKeyDown(event: EventKeyboard) {
        // Управление движением по оси X и Y
        switch (event.keyCode) {
            case KeyCode.KEY_A:
                this.velocity.x = -1;
                break;
            case KeyCode.KEY_D:
                this.velocity.x = 1;
                break;
            case KeyCode.KEY_W:
                this.velocity.y = 1;
                break;
            case KeyCode.KEY_S:
                this.velocity.y = -1;
                break;
        }
    }

    // Обработчик отпускания клавиш
    private onKeyUp(event: EventKeyboard) {
        // Останавливаем движение по соответствующим осям при отпускании клавиш
        switch (event.keyCode) {
            case KeyCode.KEY_A:
            case KeyCode.KEY_D:
                this.velocity.x = 0;
                break;
            case KeyCode.KEY_W:
            case KeyCode.KEY_S:
                this.velocity.y = 0;
                break;
        }
    }

    // Метод для проигрывания анимаций
    private playAnimation(animationName: string) {
        if (this.currentAnimation !== animationName && this.anim) {
            this.currentAnimation = animationName;
            this.anim.play(this.currentAnimation);
        }
    }
}
