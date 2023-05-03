import { Size, Vector3D } from "../utils/position";

export enum VolumetricColliderType {
    Box, Sphere
};

export default class VolumetricCollider {
    type: VolumetricColliderType = VolumetricColliderType.Box;
    position: Vector3D;
    size: Size;
    angle: number;

    constructor(position: Vector3D, size: Size, angle: number = 0) {
        this.position = position;
        this.size = size;
        this.angle = angle;
    }
}