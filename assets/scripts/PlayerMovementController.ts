import { _decorator, Component, Node, Vec3, EventTouch, input, Input, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerMovementController')
export class PlayerMovementController extends Component {
    @property
    moveSpeed: number = 10; // Скорость передвижения персонажа

    private direction: Vec3 = new Vec3(0, 0, 0); // Направление движения
    private startTouchPosition: Vec3 | null = null; // Начальная позиция касания

    start() {
        // Подписываемся на события касания экрана
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    update(deltaTime: number) {
        // Движение персонажа в направлении касания
        if (this.direction.length() > 0) {
            let moveOffset = this.direction.clone().normalize().multiplyScalar(this.moveSpeed * deltaTime);
            this.node.setPosition(this.node.position.add(moveOffset));
        }
    }

    private onTouchStart(event: EventTouch) {
        console.log("OnTouchStart");
        const touchPos = event.getLocation(); // Получаем Vec2
        this.startTouchPosition = new Vec3(touchPos.x, 0, touchPos.y); // Сохраняем начальную позицию касания
        this.updateDirection(touchPos); // Обновляем направление
    }

    private onTouchMove(event: EventTouch) {
        console.log("OnTouchMove");
        const touchPos = event.getLocation(); // Получаем Vec2
        this.updateDirection(touchPos); // Обновляем направление
    }

    private onTouchEnd(event: EventTouch) {
        this.direction.set(0, 0, 0); // Остановка движения
        this.startTouchPosition = null; // Сбрасываем начальную позицию
    }

    private updateDirection(touchPos: Vec2) {
        if (this.startTouchPosition) {
            // Преобразование Vec2 в Vec3, устанавливая Y на 0
            const worldPos = new Vec3(touchPos.x, 0, touchPos.y);

            // Вычисляем направление относительно начальной позиции касания
            this.direction.set(worldPos.x, 0, worldPos.z).subtract(this.startTouchPosition).normalize();
        }
    }
}
