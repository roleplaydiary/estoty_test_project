import { _decorator, Component, Node } from 'cc';
import { ResourceController } from './ResourceController'; // Импортируем ResourceController
const { ccclass, property } = _decorator;

@ccclass('MapObjects')
export class MapObjects extends Component {
    private static _instance: MapObjects | null = null;
    private mapObjects: ResourceController[] = []; // Массив объектов карты (ResourceController)

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
            this.initializeMapObjects(); // Инициализируем объекты карты
        }
    }

    private initializeMapObjects() {
        this.mapObjects = this.node.children
            .map(child => child.getComponent(ResourceController)) 
            .filter(controller => controller !== null) as ResourceController[]; 
    }

    public removeMapObject(controller: ResourceController) {
        const index = this.mapObjects.indexOf(controller);
        if (index !== -1) {
            this.mapObjects.splice(index, 1); 
        }
        
        controller.node.destroy();
    }

    public getMapObjects(): ResourceController[] {
        return this.mapObjects;
    }
}
