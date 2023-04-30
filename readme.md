# **Left Engine**
## Left
## Methods
```ts
let engine = new Left(canvas: HTMLCanvasElement);

// update engine
engine.update();
```

## **Render**
## Methods
```ts
let render = new Render(context: WebGLRenderingContext, parent: Left);

// clear render
render.clear();

// set lights
render.setLights(lights: Light[]): this;

// drawing images
render.drawImage(position: Vector3D, size: Size, url: string, shader?: Shader, color?: Color | Color[], rotation?: number, rotationCenter?: Vector2D);
render.drawImage(position, size, drawMethod: [url: string, 'wrap' | 'clamp'], shader?, color?, rotation?, rotationCenter?);
render.drawImage3D(position, size, url, shader?, color?, rotation, rotationCenter);
render.drawImage3D(position, size, drawMethod, shader?, color?, rotation?, rotationCenter?);

// drawing images with normals
render.drawImageWithNormal(position: Vector3D, size: Size, url: string, normalUrl: string, shader?: Shader, color?: Color | Color[], rotation?: number, rotationCenter?: Vector2D);
render.drawImageWithNormal(position, size, drawMethod: [url: string, 'wrap' | 'clamp'], normalDrawMethod: [normalUrl: string, 'wrap' | 'clamp'], shader?, color?, rotation?, rotationCenter?);
render.drawImage3DWithNormal(position, size, url, normalUrl, shader?, color?, rotation?, rotationCenter?);
render.drawImage3DWithNormal(position, size, drawMethod, normalDrawMethod, shader?, color?, rotation?, rotationCenter?);

// drawing section of image
render.drawImageSection(position: Vector3D, size: Size, uv: Vector4D, url: string, shader?: Shader, color?: Color | Color[], rotation?: number, rotationCenter?: Vector2D);
render.drawImageSection(position, size, uv, drawMethod: [url: string, 'wrap' | 'clamp'], shader?, color?, rotation?, rotationCenter?);
render.drawImageSection3D(position, size, uv, url, shader?, color?, rotation?, rotationCenter?);
render.drawImageSection3D(position, size, uv, drawMethod: [url: string, 'wrap' | 'clamp'], shader?, color?, rotation?, rotationCenter?);

// drawing rectangles
render.drawRectangle(position: Vector3D, size: Size, color?: Color, shader?: Shader);
render.drawRectangle3D(position, size, color?, shader?);

// drawing custom shader
render.drawShader(position: Vector3D, size: Size, shader: Shader, color?: Color | Color[], rotation?: number, rotationCenter?: Vector2D);
render.drawShader3D(position, size, shader, color?, rotation?, rotationCenter?);

// getting screen from world position and vice versa
render.getScreenFromWorldPosition(position: Vector3D): Vector3D;
render.getWorldPositionFromScreen(position: Vector2D, depth?: number): Vector3D;

// get dimensions by z (depth)
render.getDimensions(dimensions: Size, z: number): Size;

// finish drawing scene
render.drawArrays();
```

## **Shaders**
## Example
```ts
let shaderCode = `
struct VSInput {
    vec4 Position : POSITION0;
    mat4 Matrix : MATRIX;
};

struct PSInput {
    vec2 TexCoord : TEXCOORD0;
    vec4 Position : POSITION0;
    vec4 Diffuse : DIFFUSE0;
};

PSInput vertexShaderFunction(VSInput VS) {
    PSInput PS;
    PS.Position = VS.Matrix * VS.Position;
    return PS;
}

vec4 pixelShaderFunction(PSInput PS) {
    return PS.Diffuse;
}
`;

let shader: Shader = new Shader(game.context, shaderCode);
```

## Methods
```ts
type ShaderVariableType = 'float' | 'matrix' | 'texture' | 'int' | 'vec2' | 'vec3' | 'vec4' | 'bool';
shader.setValue(variable: string, value: any, type: ShaderVariableType): this;
```

## Vertex Definitions
```glsl
TEXCOORD0 - Texture Coordinate [vec2]
TEXCOORD1 - UV Size [vec2]
POSITION0 - Position [vec2]
ROTATION0 - Rotation [float]
ROTATION1 - Rotation Center [vec2]
WORLDPOS - World Position [vec3]
WORLDSIZE - World Size [vec2]
DIFFUSE0 - Diffuse Color [vec4]
MATRIX - Matrix [mat4],
```

## Pixel Shader Functions
```glsl
// distance between 2 points with aspect ratio
float aspectDistance2D(vec2 position0, vec2 position1);

// applies light, only for advanced users, use @applyWorldLights instead
vec4 applyWorldLight(vec4 color, vec4 screenCoord, vec2 normal, vec3 lightPosition, vec4 lightColor, float lightSize);

// applies all world lights to pixel
vec4 applyWorldLights(vec4 color, vec2 normal, vec4 screenCoord, bool onlySunLight);

// rotates normals
vec2 rotateNormals(vec2 normals, float rotation);
```