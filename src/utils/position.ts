import { degrees, radians } from "./angle";

class Vector {
    x: number;
    y: number;
    z: number | undefined;
    w: number | undefined;

    constructor(x: number, y: number, z?: number, w?: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    array() {
        return [this.x, this.y, this.z, this.w];
    }
    
    add(x?: number | Vector, y?: number, z?: number, w?: number): this {
        if(x instanceof Vector) {
            this.add(x.x, x.y, x.z, x.w);
            return this;
        }

        if(x) this.x += x;
        if(y) this.y += y;
        if(this.z != undefined && z) this.z += z;
        if(this.w != undefined && w) this.w += w;
        return this;
    }
    
    sub(x?: number | Vector, y?: number, z?: number, w?: number): this {
        if(x instanceof Vector) {
            this.sub(x.x, x.y, x.z, x.w);
            return this;
        }

        if(x) this.x -= x;
        if(y) this.y -= y;
        if(this.z != undefined && z) this.z -= z;
        if(this.w != undefined && w) this.w -= w;
        return this;
    }
    
    multiply(x: number | Vector, y?: number, z?: number, w?: number): this {
        if(x instanceof Vector) {
            this.multiply(x.x, x.y, x.z, x.w);
            return this;
        }

        if(!y) {
            this.x *= x;
            this.y *= x;
            if(this.z != undefined) this.z *= x;
            if(this.w != undefined) this.w *= x;
        } else {
            if(x) this.x *= x;
            if(y) this.y *= y;
            if(this.z != undefined && z) this.z *= z;
            if(this.w != undefined && w) this.w *= w;
        }
        return this;
    }
    
    divide(x: number | Vector, y?: number, z?: number, w?: number): this {
        if(x instanceof Vector) {
            this.divide(x.x, x.y, x.z, x.w);
            return this;
        }

        if(!y) {
            this.x /= x;
            this.y /= x;
            if(this.z != undefined) this.z /= x;
            if(this.w != undefined) this.w /= x;
        } else {
            if(x) this.x /= x;
            if(y) this.y /= y;
            if(this.z != undefined && z) this.z /= z;
            if(this.w != undefined && w) this.w /= w;
        }
        return this;
    }

    set(x?: number | Vector, y?: number, z?: number, w?: number) {
        if(x instanceof Vector) {
            this.set(x.x, x.y, x.z, x.w);
            return this;
        }
        
        if(x && this.x != undefined) this.x = x;
        if(y && this.y != undefined) this.y = y;
        if(z && this.z != undefined) this.z = z;
        if(w && this.w != undefined) this.w = w;
        return this;
    }


    normalize() {
        let length = this.length();
        this.divide(length);
        return this;
    }

    length() {
        let squared = this.x * this.x + this.y * this.y;
        if(this.z) {
            squared += this.z * this.z;
            if(this.w) squared += this.w * this.w;
        }
        return Math.sqrt(squared);
    }
    
    distance(x: number | Vector, y?: number, z?: number, w?: number): number {
        if(x instanceof Vector) {
            return this.distance(x.x, x.y, x.z, x.w);
        }

        let xd = this.x - x;
        let yd = this.y - (y || 0);
        let zd = 0;
        let wd = 0;
        if(z && this.z != undefined) zd = this.z - z;
        if(w && this.w != undefined) wd = this.w - w;
        let squared = xd * xd + yd * yd;
        if(zd) squared += zd * zd;
        if(wd) squared += wd * wd;
        return Math.sqrt(squared);
    }
    
    dot(x: number | Vector, y?: number, z?: number, w?: number): number {
        if(x instanceof Vector) {
            return this.dot(x.x, x.y, x.z, x.w);
        }

        let output = this.x * x + this.y * (y || 0);
        if(this.z != undefined && z) output += this.z * z;
        if(this.w != undefined && w) output += this.w * w;
        return output;
    }

    clone() {
        return new Vector(this.x, this.y, this.z, this.w);
    }

    findRotation(x: number | Vector, y?: number): number {
        if(x instanceof Vector) {
            return this.findRotation(x.x, x.y);
        }

        const deltaX = x - this.x;
        const deltaY = (y || 0) - this.y;
        
        const yaw = Math.atan2(deltaY, deltaX);
        
        return -degrees(yaw);
    }

    rotate(angle: number): this {
        let distance = this.length();
        let currentAngle = this.findRotation(0, 0);
        this.x = distance * Math.cos(radians(currentAngle - angle + 180));
        this.y = distance * Math.sin(radians(currentAngle - angle + 180));

        return this;
    }
}

export class Vector2D extends Vector {
    constructor(x: number = 0, y: number = 0) {
        super(x, y);
    }
    
    static from(vector: Vector2D | Vector3D | Vector4D): Vector2D {
        return new Vector2D(vector.x, vector.y);
    }
}

export class Vector3D extends Vector {
    z: number;

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        super(x, y, z);
        this.z = z;
    }

    static from(vector: Vector2D | Vector3D | Vector4D, z: number = 0): Vector3D {
        return new Vector3D(vector.x, vector.y, vector.z || z);
    }
}

export class Vector4D extends Vector {
    z: number;
    w: number;

    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
        super(x, y, z, w);
        this.z = z;
        this.w = w;
    }
    
    static from(vector: Vector2D | Vector3D | Vector4D, z: number = 0, w: number = 0): Vector4D {
        return new Vector4D(vector.x, vector.y, vector.z || z, vector.w || w);
    }
}

export class Size extends Vector {
    constructor(x: number = 0, y: number = 0) {
        super(x, y);
    }
}