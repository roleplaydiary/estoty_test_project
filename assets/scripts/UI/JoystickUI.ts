import { _decorator, Component, Node, Vec2, UITransform, EventTouch, input, Input } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('JoystickUI')
export class JoystickUI extends Component {
    @property(Node)
    joystickArea: Node | null = null; // Площадь нажатия

    @property(Node)
    joystick: Node | null = null; // Сам джойстик

    private startTouchPos: Vec2 = new Vec2(); // Стартовая позиция нажатия
    private maxJoystickDistance: number = 100; // Максимальное расстояние движения джойстика

    start() {
        // Подписываемся на события касания
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);

        // Скрываем джойстик в начале
        //this.resetJoystick();
    }

    onTouchStart(event: EventTouch) {
        // Получаем начальную позицию касания
        const touchPos = event.getUILocation();
        this.startTouchPos.set(touchPos.x, touchPos.y);

        // Устанавливаем позиции для области и самого джойстика
        this.joystickArea?.setPosition(touchPos.x, touchPos.y);
        this.joystick?.setPosition(touchPos.x, touchPos.y);

        // Отображаем область и джойстик
        this.joystickArea.active = true;
        this.joystick.active = true;
    }

    onTouchMove(event: EventTouch) {
        // Обновляем позицию джойстика в зависимости от перемещения пальца
        const touchPos = event.getUILocation();
        const delta = new Vec2(touchPos.x - this.startTouchPos.x, touchPos.y - this.startTouchPos.y);

        // Ограничиваем движение джойстика в радиусе maxJoystickDistance
        if (delta.length() > this.maxJoystickDistance) {
            delta.normalize().multiplyScalar(this.maxJoystickDistance);
        }

        // Устанавливаем новую позицию джойстика
        this.joystick?.setPosition(this.startTouchPos.x + delta.x, this.startTouchPos.y + delta.y);
    }

    onTouchEnd() {
        // Сбрасываем джойстик при завершении касания
        this.resetJoystick();
    }

    private resetJoystick() {
        // Скрываем джойстик и область
        this.joystickArea.active = false;
        this.joystick.active = false;
    }
}
