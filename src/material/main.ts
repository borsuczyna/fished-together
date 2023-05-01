import LeftRender from "../render/render";
import { Size, Vector2D, Vector3D } from "../utils/position";

export default class Material {
    url: string;
    normal?: string;
    offset: Vector2D = new Vector2D(0, 0);
    scale: Size = new Size(1, 1);

    constructor(url: string, normal?: string) {
        this.url = url;
        this.normal = normal;
    }

    draw(render: LeftRender, position: Vector3D, size: Size, rotation: number = 0, rotationCenter: Vector2D = new Vector2D(.5, .5)) {
        let drawPosition = position.clone().add(
            new Vector3D(this.offset.x * size.x, this.offset.y * size.y, 0).rotate(rotation)
        ) as Vector3D;
        let drawSize = size.clone().multiply(this.scale);

        if(!this.normal) render.drawImage3D(drawPosition, drawSize, this.url, undefined, undefined, rotation, rotationCenter);
        else render.drawImage3DWithNormal(drawPosition, drawSize, this.url, this.normal, undefined, undefined, rotation, rotationCenter);
    }
}