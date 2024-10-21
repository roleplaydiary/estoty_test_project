import { _decorator, Component, Node, Vec3, EventTouch, input, Input, Vec2, PhysicsSystem, geometry, PhysicsRayResult } from 'cc';
import { AnimationController } from './AnimationController';

const { ccclass, property } = _decorator;

@ccclass('PlayerMovementController')
export class PlayerMovementController extends Component {
    @property(Node)
    cameraNode: Node | null = null; // Ссылка на камеру

    @property
    moveSpeed: number = 10; // Скорость передвижения персонажа

    private direction: Vec3 = new Vec3(0, 0, 0); // Направление движения
    private startTouchPosition: Vec3 | null = null; // Начальная позиция касания
    private animationController: AnimationController | null = null; // Ссылка на AnimationController

    private raycastDistance: number = 1.0; // Дистанция для Raycast проверки

    start() {
        this.animationController = this.getComponent(AnimationController); // Получаем AnimationController
        if (!this.animationController) {
            console.error('AnimationController не найден на объекте!');
        }

        // Подписываемся на события касания экрана
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    update(deltaTime: number) {
        // Если есть направление движения и нет препятствий — двигаемся
        if (this.direction.length() > 0  && !this.isObstacleInDirection()) {
            let moveOffset = this.direction.clone().normalize().multiplyScalar(this.moveSpeed * deltaTime);
            this.node.setPosition(this.node.position.add(moveOffset));
            this.animationController?.playAnimation('Armature.001|Armature.001|RUN'); // Запускаем анимацию бега

            // Поворачиваем персонажа в сторону движения
            this.rotateCharacter();
        } else {
            this.animationController?.playAnimation('Armature.001|Armature.001|IDLE'); // Запускаем анимацию стояния
        }
    }

    private onTouchStart(event: EventTouch) {
        const touchPos = event.getLocation(); // Получаем Vec2
        this.startTouchPosition = new Vec3(touchPos.x, 0, touchPos.y); // Сохраняем начальную позицию касания
        this.updateDirection(touchPos); // Обновляем направление
    }

    private onTouchMove(event: EventTouch) {
        const touchPos = event.getLocation(); // Получаем Vec2
        this.updateDirection(touchPos); // Обновляем направление
    }

    private onTouchEnd(event: EventTouch) {
        this.direction.set(0, 0, 0); // Остановка движения
        this.startTouchPosition = null; // Сбрасываем начальную позицию
        this.animationController?.playAnimation('Armature.001|Armature.001|IDLE'); // Запускаем анимацию стояния
    }

    private updateDirection(touchPos: Vec2) {
        if (this.startTouchPosition && this.cameraNode) {
            // Преобразование Vec2 в Vec3, устанавливая Y на 0
            const worldPos = new Vec3(touchPos.x, 0, touchPos.y);

            // Получаем направление камеры
            const cameraForward = this.cameraNode.forward.clone(); // Направление вперед камеры
            const cameraRight = this.cameraNode.right.clone(); // Направление вправо камеры

            // Игнорируем вертикальную ось для камеры
            cameraForward.y = 0;
            cameraRight.y = 0;
            cameraForward.normalize();
            cameraRight.normalize();

            // Вычисляем направление движения относительно начальной позиции касания
            const delta = new Vec3(worldPos.x, 0, worldPos.z).subtract(this.startTouchPosition);
            if (delta.length() > 0) {
                this.direction.set(
                    cameraForward.x * delta.z + cameraRight.x * delta.x,
                    0,
                    cameraForward.z * delta.z + cameraRight.z * delta.x
                );
                this.direction.normalize();
            }
        }
    }

    private rotateCharacter() {
        // Получаем направление движения
        const forward = this.direction.clone().normalize();
        if (forward.length() > 0) {
            // Вычисляем угол поворота с учётом корректировки
            const angle = Math.atan2(forward.z, forward.x) * (180 / Math.PI); // Угол в градусах
    
            const correctionAngle = 90; // Корректирующий угол (если модель повернута на 45 градусов)
            
            // Поворачиваем персонажа (Y-угол), добавляя корректирующий угол
            this.node.setRotationFromEuler(0, -angle + correctionAngle, 0);
        }
    }

    // Метод для проверки наличия препятствий с помощью Raycast
    private isObstacleInDirection(): boolean { // Пока не работает, доделать позже
        return false;
        /*
        const rayStart = this.node.worldPosition;
        const rayEnd = new Vec3(
            rayStart.x + this.direction.x * 0.5, 
            rayStart.y,
            rayStart.z + this.direction.z * 0.5 
        );

        const ray = new geometry.Ray(rayStart.x, rayStart.y, rayStart.z, rayEnd.x, rayEnd.y, rayEnd.z);
        
        if (PhysicsSystem.instance.raycastClosest(ray)) {
            const hitResult: PhysicsRayResult = PhysicsSystem.instance.raycastClosestResult;
            if (hitResult.collider) {
                // Найден объект с коллайдером
                return true;
            }
        }
        
        // Если не нашли коллайдера на пути
        return false;*/
    }
}
