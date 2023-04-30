import Left from "../../left/main";
import Camera from "./camera";

export default class FreeCam extends Camera {
    speed: number = 90;

    update() {
        let engine: Left = this.parent;
        if(engine.keyboard.isKeyDown('a')) {
            this.position.add(-this.speed/10);
        } else if(engine.keyboard.isKeyDown('d')) {
            this.position.add(this.speed/10);
        }
        if(engine.keyboard.isKeyDown('s')) {
            this.position.add(0, -this.speed/10);
        } else if(engine.keyboard.isKeyDown('w')) {
            this.position.add(0, this.speed/10);
        }
    }
}