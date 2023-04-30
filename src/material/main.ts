import Render from "../render/render";
import { Size, Vector2D, Vector3D } from "../utils/position";

export default class Material {
    url: string;
    normal?: string;

    constructor(url: string, normal?: string) {
        this.url = url;
        this.normal = normal;
    }

    draw(render: Render, position: Vector3D, size: Size, rotation: number = 0, rotationCenter: Vector2D = new Vector2D(.5, .5)) {
        if(!this.normal) render.drawImage3D(position, size, this.url, undefined, undefined, rotation);
        else render.drawImage3DWithNormal(position, size, this.url, this.normal, undefined, undefined, rotation);
    }
}