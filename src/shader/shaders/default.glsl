struct VSInput {
    vec2 TexCoord : TEXCOORD0;
    vec4 Position : POSITION0;
    float Rotation : ROTATION0;
    vec2 RotationCenter : ROTATION1;
    vec3 WorldPos : WORLDPOS;
    vec2 WorldSize : WORLDSIZE;
    mat4 Matrix : MATRIX;
};

struct PSInput {
    vec2 TexCoord : TEXCOORD0;
    vec4 Position : POSITION0;
    float Rotation : ROTATION0;
    vec2 Normal : NORMAL0;

    vec4 Diffuse;
    vec4 ScreenCoord;
};

PSInput vertexShaderFunction(VSInput VS) {
    PSInput PS;

    mat2 rotationMatrix = mat2(cos(VS.Rotation), -sin(VS.Rotation), sin(VS.Rotation), cos(VS.Rotation));
    VS.Position.xy = rotationMatrix * (VS.Position.xy - VS.RotationCenter) + VS.RotationCenter;

    PS.TexCoord = VS.TexCoord;
    PS.Position = VS.Matrix * VS.Position;

    PS.ScreenCoord.xy = (PS.Position.xy+1.0)/2.0;
    PS.ScreenCoord.y = 1.0-PS.ScreenCoord.y;
    PS.ScreenCoord.z = VS.WorldPos.z;

    PS.Rotation = -VS.Rotation;

    return PS;
}

vec4 pixelShaderFunction(PSInput PS) {
    vec4 color = texture2D(texture, vec2(PS.TexCoord.x, PS.TexCoord.y));

    // rotate normal
    PS.Normal = rotateNormals(PS.Normal, PS.Rotation);

    color *= PS.Diffuse;
    color.rgb *= color.a;
    color = applyWorldLights(color, PS.Normal, PS.ScreenCoord, false);

    return color;
}