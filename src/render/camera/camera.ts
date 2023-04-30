import Left from "../../left/main";
import { Vector2D } from "../../utils/position";

export default class Camera {
    parent: Left;
    zoom: number = 1;
    position: Vector2D = new Vector2D();

    constructor(parent: Left) {
        this.parent = parent;
    }

    update() {}
}