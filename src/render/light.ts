import { Vector3D } from "../uitls/position";
import Color from "./color";

export default class Light {
    position: Vector3D = new Vector3D();
    color: Color = new Color();
    size: number = 1;

    setPosition(position: Vector3D) {
        this.position = position;
        return this;
    }

    setColor(color: Color) {
        this.color = color;
        return this;
    }

    setSize(size: number) {
        this.size = size;
        return this;
    }
}