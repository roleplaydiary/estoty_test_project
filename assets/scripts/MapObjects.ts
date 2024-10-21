import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MapObjects')
export class MapObjects extends Component {
    private static _instance: MapObjects | null = null;
    private mapObjects: Node[] = []; // Массив объектов карты

    // Метод для получения экземпляра синглтона
    public static get instance(): MapObjects {
        if (!this._instance) {
            console.error('MapObjects instance is not initialized.');
        }
        return this._instance!;
    }

    onLoad() {
        if (MapObjects._instance) {
            this.destroy();
        } else {
            MapObjects._instance = this;
            this.mapObjects = [...this.node.children];
        }
    }

    public getMapObjects(): Node[] {
        return this.mapObjects;
    }
}
