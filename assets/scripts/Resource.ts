import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Resource')
export class Resource {
    @property
    public id = 0;

    @property
    public quantity = 0;

    constructor(id: number, quantity: number) {
        this.id = id;
        this.quantity = quantity;
    }
}
