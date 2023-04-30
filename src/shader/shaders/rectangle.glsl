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
};

PSInput vertexShaderFunction(VSInput VS) {
    PSInput PS;

    // mat2 rotationMatrix = mat2(cos(VS.Rotation), -sin(VS.Rotation), sin(VS.Rotation), cos(VS.Rotation));
    // VS.Position.xy = rotationMatrix * (VS.Position.xy - VS.RotationCenter) + VS.RotationCenter;

    PS.Position = VS.Matrix * VS.Position;

    PS.ScreenCoord.xy = (PS.Position.xy+1.0)/2.0;
    PS.ScreenCoord.y = 1.0-PS.ScreenCoord.y;

    return PS;
}

vec4 pixelShaderFunction(PSInput PS) {
    PS.Diffuse = applyWorldLights(PS.Diffuse, PS.Normal, PS.ScreenCoord, false);
    return PS.Diffuse;
}