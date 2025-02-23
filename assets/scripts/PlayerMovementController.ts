import { _decorator, Component, Node, Vec3, EventTouch, input, Input, Vec2 } from 'cc';
import { AnimationController } from './AnimationController';
import { PlayerAttackController } from './PlayerAttackController';
import { PlayerState } from './playerState/PlayerState';
import { IdleState } from './playerState/IdleState';
import { RunState } from './playerState/RunState';
import { AttackState } from './playerState/AttackState';
import { MapObjects } from './MapObjects';

const { ccclass, property } = _decorator;

@ccclass('PlayerMovementController')
export class PlayerMovementController extends Component {
    private static _instance: PlayerMovementController;
    
    @property(Node)
        cameraNode: Node | null = null;

    @property
        moveSpeed: number = 10;

    public direction: Vec3 = new Vec3(0, 0, 0);
    private startTouchPosition: Vec3 | null = null;
    public animationController: AnimationController | null = null;
    private currentState: PlayerState | null = null;
    private playerAttackController: PlayerAttackController | null = null;

    public static get instance(): PlayerMovementController {
        return this._instance;
    }

    onLoad() {
        if (PlayerMovementController._instance) {
            console.error("Multiple instances of PlayerMovementController detected!");
            return;
        }
        PlayerMovementController._instance = this;
    }

    start() {
        this.animationController = this.getComponent(AnimationController);
        this.playerAttackController = this.getComponent(PlayerAttackController);

        if (!this.animationController || !this.playerAttackController) {
            console.error('Не найдены необходимые компоненты!');
            return;
        }

        this.changeState('idle');

        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    update(deltaTime: number) {
        if (this.currentState) {
            this.currentState.update(deltaTime);
        }
    }

    changeState(state: 'idle' | 'run' | 'attack') {
        this.currentState?.exit();

        if (state === 'idle') {
            this.currentState = new IdleState(this);
        } else if (state === 'run') {
            this.currentState = new RunState(this);
        } else if (state === 'attack') {
            this.currentState = new AttackState(this, this.playerAttackController!);
        }

        this.currentState.enter();
    }

    private onTouchStart(event: EventTouch) {
        const touchPos = event.getLocation();
        this.startTouchPosition = new Vec3(touchPos.x, 0, touchPos.y);
        this.updateDirection(touchPos);
    }

    private onTouchMove(event: EventTouch) {
        const touchPos = event.getLocation();
        this.updateDirection(touchPos);
        this.changeState('run');
    }

    private onTouchEnd(event: EventTouch) {
        this.direction.set(0, 0, 0);
        this.startTouchPosition = null;

        // Проверяем наличие объектов вокруг игрока
        const targetsInRange = this.checkForTargets();
        if (targetsInRange.length > 0) {
            this.changeState('attack'); // Если объекты найдены, переходим в состояние атаки
        } else {
            this.changeState('idle'); // Если объектов нет, возвращаемся в состояние ожидания
        }
    }

    private checkForTargets(): Node[] {
        const attackRadius = 1.5; // Радиус атаки
        const playerPosition = this.node.worldPosition; // Позиция игрока
        const allObjects = MapObjects.instance.getMapObjects(); // Получаем все объекты на карте
        const targetsInRange: Node[] = [];

        allObjects.forEach((targetNode) => {
            if (targetNode.node !== this.node) {
                const distance = Vec3.distance(playerPosition, targetNode.node.worldPosition);
                if (distance <= attackRadius) {
                    targetsInRange.push(targetNode.node); // Добавляем объекты в диапазоне
                }
            }
        });

        return targetsInRange; // Возвращаем найденные объекты
    }

    public rotateCharacter() {
        const forward = this.direction.clone().normalize();
        if (forward.length() > 0) {
            const angle = Math.atan2(forward.z, forward.x) * (180 / Math.PI);
            const correctionAngle = 90;
            this.node.setRotationFromEuler(0, -angle + correctionAngle, 0);
        }
    }

    private updateDirection(touchPos: Vec2) {
        if (this.startTouchPosition && this.cameraNode) {
            const worldPos = new Vec3(touchPos.x, 0, touchPos.y);
            const cameraForward = this.cameraNode.forward.clone();
            const cameraRight = this.cameraNode.right.clone();

            cameraForward.y = 0;
            cameraRight.y = 0;
            cameraForward.normalize();
            cameraRight.normalize();

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

    onDestroy() {
        if (PlayerMovementController._instance === this) {
            PlayerMovementController._instance = null;
        }
    }
}
