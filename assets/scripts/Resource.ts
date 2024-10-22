import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Resource')
export class Resource {
    @property
    public id: number;

    @property
    public quantity: number;

    constructor(id: number, quantity: number) {
        this.id = id;
        this.quantity = quantity;
    }
}
