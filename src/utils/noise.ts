export default class Noise {
    private MAX_VERTICES = 256;
    private MAX_VERTICES_MASK = this.MAX_VERTICES - 1;
    private amplitude = 1;
    private scale = 1;
    private r: number[] = [];
  
    constructor() {
        for (let i = 0; i < this.MAX_VERTICES; ++i) {
            this.r.push(Math.random());
        }
    }
  
    private lerp(a: number, b: number, t: number): number {
        return a * (1 - t) + b * t;
    }
  
    private remapSmoothstep(t: number): number {
        return t * t * (3 - 2 * t);
    }
  
    private getVal(x: number): number {
        const scaledX = x * this.scale;
        const xFloor = Math.floor(scaledX);
        const t = scaledX - xFloor;
        const tRemapSmoothstep = this.remapSmoothstep(t);
    
        // Modulo using '&'
        const xMin = xFloor & this.MAX_VERTICES_MASK;
        const xMax = (xMin + 1) & this.MAX_VERTICES_MASK;
    
        const y = this.lerp(this.r[xMin], this.r[xMax], tRemapSmoothstep);
    
        return y * this.amplitude;
    }
  
    public setAmplitude(newAmplitude: number): void {
        this.amplitude = newAmplitude;
    }
  
    public setScale(newScale: number): void {
        this.scale = newScale;
    }
  
    public getValue(x: number): number {
        return this.getVal(x);
    }
}
  