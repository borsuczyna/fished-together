import { Size, Vector3D } from "../utils/position";

export enum BarrierType {
    Box, Sphere
};

export default class Barrier {
    type: BarrierType = BarrierType.Box;
    position: Vector3D;
    size: Size;
    angle: number;

    constructor(position: Vector3D, size: Size, angle: number = 0) {
        this.position = position;
        this.size = size;
        this.angle = angle;
    }
}