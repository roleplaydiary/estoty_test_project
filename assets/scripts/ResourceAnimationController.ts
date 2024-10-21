import { _decorator, Component, Node, Color, tween, Vec3, Sprite } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('ResourceAnimationController')
export class ResourceAnimationController extends Component {
    private static readonly JUMP_HEIGHT: number = 0.5; // Высота подпрыгивания
    private static readonly JUMP_DURATION: number = 0.2; // Длительность подпрыгивания
    private static readonly FLASH_COLOR: Color = new Color(255, 255, 255); // Цвет вспышки
    private static readonly ORIGINAL_COLOR: Color = new Color(255, 255, 255); // Цвет оригинала
    private static readonly DISAPPEAR_DURATION: number = 0.5; // Длительность исчезновения

    public playHitAnimation(node: Node) {
        // Вспышка цвета
        const spriteRenderer = node.getComponent(Sprite);
        if (spriteRenderer) {
            spriteRenderer.color = ResourceAnimationController.FLASH_COLOR;
        }

        // Подпрыгивание
        const originalPosition = node.position.clone();
        tween(node)
            .by(ResourceAnimationController.JUMP_DURATION, { position: new Vec3(0, ResourceAnimationController.JUMP_HEIGHT, 0) })
            .by(ResourceAnimationController.JUMP_DURATION, { position: new Vec3(0, -ResourceAnimationController.JUMP_HEIGHT, 0) })
            .call(() => {
                // Восстанавливаем цвет после анимации
                if (spriteRenderer) {
                    spriteRenderer.color = ResourceAnimationController.ORIGINAL_COLOR;
                }
            })
            .start();
    }

    public playDisappearAnimation(node: Node, onComplete?: () => void) {
        // Изменение масштаба до нуля
        tween(node)
            .to(ResourceAnimationController.DISAPPEAR_DURATION, { scale: new Vec3(0, 0, 0) })
            .call(() => {
                // Вызываем функцию завершения, если она передана
                if (onComplete) {
                    onComplete();
                }
            })
            .start();
    }
}
