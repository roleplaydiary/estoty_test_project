import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TestButton')
export class TestButton extends Component {
    private onTestButtonPressed() {
        mraid.open(); // put this whenever you need
    }
}


