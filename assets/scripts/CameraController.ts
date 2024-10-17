import { _decorator, Component, Node, Vec3, Quat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component {
    @property(Node)
    playerNode: Node | null = null; // ������ �� ������ ������

    @property
    cameraOffset: Vec3 = new Vec3(0, 5, -10); // �������� ������ ������������ ������

    @property
    followSpeed: number = 5; // �������� ���������� ������

    private targetPosition: Vec3 = new Vec3(); // ������� ������� ������
    private initialRotation: Quat = new Quat(); // ����������� ������� ������

    start() {
        if (!this.playerNode) {
            console.error('Player Node �� �������� ��� CameraController!');
        }

        // ��������� ��������� ������� ������
        this.initialRotation.set(this.node.rotation);

        // ��������� ������� ������ � ������ ����
        this.updateCameraPosition(1); // ��������� ������������ � ������
    }

    update(deltaTime: number) {
        this.updateCameraPosition(deltaTime);
    }

    private updateCameraPosition(deltaTime: number) {
        if (this.playerNode) {
            // ��������� ������� ������� ������ ������������ ������ � ������ ��������
            const desiredPosition = this.playerNode.position.clone().add(this.cameraOffset);

            // ������� ������������ ������� ������ � �������� �������
            Vec3.lerp(this.targetPosition, this.node.position, desiredPosition, deltaTime * this.followSpeed);

            // ������������� ����� ������� ������
            this.node.setPosition(this.targetPosition);

            // ��������� ��������� ������ ������ (rotation.x = -45)
            this.node.setRotation(this.initialRotation);
        }
    }
}
