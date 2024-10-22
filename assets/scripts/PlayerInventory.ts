import { _decorator, Component } from 'cc';
import { Resource } from './Resource';
const { ccclass, property } = _decorator;

@ccclass('PlayerInventory')
export class PlayerInventory extends Component {
    @property([Resource])
        private resources: Resource[] = [];

    private resourceNames: { [id: number]: string } = {
        1: 'Wood',
        2: 'Stone',
        3: 'Iron',
    };

    public addResource(id: number, quantity: number) {
        const resource = this.getResource(id);

        if (resource) {
            resource.quantity += quantity;
        } else {
            this.resources.push(new Resource(id, quantity));
        }
    }

    public removeResource(id: number, quantity: number): boolean {
        const resource = this.getResource(id);

        if (resource) {
            if (resource.quantity >= quantity) {
                resource.quantity -= quantity;
                if (resource.quantity === 0) {
                    this.resources = this.resources.filter(r => r.id !== id);
                }
                return true;
            }
        }
        return false;
    }

    public getResource(id: number): Resource | null {
        return this.resources.find(resource => resource.id === id) || null;
    }

    public checkResource(id: number): number {
        const resource = this.getResource(id);
        return resource ? resource.quantity : 0;
    }

    public showInventory() {
        this.resources.forEach(resource => {
            const resourceName = this.resourceNames[resource.id] || 'Unknown Resource';
            console.log(`Resource: ${resourceName}, Quantity: ${resource.quantity}`);
        });
    }
}
