import { _decorator, Component, Node, Vec2, UITransform, EventTouch, input, Input, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('JoystickUI')
export class JoystickUI extends Component {
    @property(Node)
        joystickArea: Node | null = null;

    @property(Node)
        joystick: Node | null = null;

    private startTouchPos: Vec2 = new Vec2();
    private maxJoystickDistance: number = 500;

    @property
        private sensitivity: number = 1.5;

    start() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);

        this.resetJoystick();
    }

    onTouchStart(event: EventTouch) {
        const touchPos = event.getUILocation();
        
        // Преобразование координат касания в локальные координаты родителя джойстика
        const parentTransform = this.node.getComponent(UITransform);
        if (parentTransform) {
            const localPos = parentTransform.convertToNodeSpaceAR(new Vec3(touchPos.x, touchPos.y, 0));
            this.startTouchPos.set(localPos.x, localPos.y);

            // Устанавливаем позицию джойстик зоны
            this.joystickArea?.setPosition(localPos.x, localPos.y);
            // Устанавливаем начальную позицию джойстика на центр зоны
            this.joystick?.setPosition(Vec3.ZERO); // Начальная позиция джойстика — это центр зоны
        }

        this.joystickArea.active = true;
        this.joystick.active = true;
    }

    onTouchMove(event: EventTouch) {
        const touchPos = event.getUILocation();
        const parentTransform = this.node.getComponent(UITransform);
        if (parentTransform) {
            const localPos = parentTransform.convertToNodeSpaceAR(new Vec3(touchPos.x, touchPos.y, 0));
            const delta = new Vec2(localPos.x - this.startTouchPos.x, localPos.y - this.startTouchPos.y);

            delta.multiplyScalar(this.sensitivity);

            if (delta.length() > this.maxJoystickDistance) {
                delta.normalize().multiplyScalar(this.maxJoystickDistance);
            }

            // Устанавливаем смещенную позицию джойстика относительно его начального положения (центра зоны)
            this.joystick?.setPosition(delta.x, delta.y);
        }
    }

    onTouchEnd() {
        this.resetJoystick();
    }

    private resetJoystick() {
        this.joystickArea.active = false;
        this.joystick.active = false;
    }
}
