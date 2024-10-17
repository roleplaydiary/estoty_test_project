import { _decorator, Component, Node, Vec3, Quat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component {
    @property(Node)
    playerNode: Node | null = null; // Ссылка на объект игрока

    @property
    cameraOffset: Vec3 = new Vec3(0, 5, -10); // Смещение камеры относительно игрока

    @property
    followSpeed: number = 5; // Скорость следования камеры

    private targetPosition: Vec3 = new Vec3(); // Целевая позиция камеры
    private initialRotation: Quat = new Quat(); // Изначальный поворот камеры

    start() {
        if (!this.playerNode) {
            console.error('Player Node не назначен для CameraController!');
        }

        // Сохраняем начальный поворот камеры
        this.initialRotation.set(this.node.rotation);

        // Обновляем позицию камеры в первый кадр
        this.updateCameraPosition(1); // Мгновенно перемещаемся к игроку
    }

    update(deltaTime: number) {
        this.updateCameraPosition(deltaTime);
    }

    private updateCameraPosition(deltaTime: number) {
        if (this.playerNode) {
            // Вычисляем целевую позицию камеры относительно игрока с учетом смещения
            const desiredPosition = this.playerNode.position.clone().add(this.cameraOffset);

            // Плавная интерполяция позиции камеры к желаемой позиции
            Vec3.lerp(this.targetPosition, this.node.position, desiredPosition, deltaTime * this.followSpeed);

            // Устанавливаем новую позицию камеры
            this.node.setPosition(this.targetPosition);

            // Сохраняем начальный наклон камеры (rotation.x = -45)
            this.node.setRotation(this.initialRotation);
        }
    }
}
