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