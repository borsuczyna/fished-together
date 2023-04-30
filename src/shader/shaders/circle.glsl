struct VSInput {
    float Rotation : ROTATION0;
    vec2 RotationCenter : ROTATION1;
    vec4 Position : POSITION0;
    mat4 Matrix : MATRIX;
};

struct PSInput {
    vec2 TexCoord : TEXCOORD0;
    vec4 Position : POSITION0;
    vec4 Diffuse : DIFFUSE0;
    vec2 Normal : NORMAL0;

    vec4 ScreenCoord;
    vec2 CirclePoint;
};

PSInput vertexShaderFunction(VSInput VS) {
    PSInput PS;

    PS.Position = VS.Matrix * VS.Position;

    PS.ScreenCoord.xy = (PS.Position.xy+1.0)/2.0;
    PS.ScreenCoord.y = 1.0-PS.ScreenCoord.y;
    PS.CirclePoint = VS.Position.xy;

    return PS;
}

vec4 pixelShaderFunction(PSInput PS) {
    PS.Diffuse = applyWorldLights(PS.Diffuse, PS.Normal, PS.ScreenCoord, false);
    
    float dist = distance(PS.CirclePoint.xy, vec2(.5, .5));
    return mix(vec4(PS.Diffuse.rgb, 1), vec4(0, 0, 0, 0), max((dist-.49)/.01, .0));
}