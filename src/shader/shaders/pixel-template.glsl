#define PI 3.1415926538

precision highp float;
uniform vec2 internal_inTexCoord;

// Textures
uniform sampler2D texture;
uniform sampler2D normalTexture;

// Uniforms
uniform float time;
uniform vec4 internal_diffuse_tl, internal_diffuse_tr, internal_diffuse_bl, internal_diffuse_br;
uniform float internal_uw, internal_uh;
uniform vec2 screenSize;
uniform float normalPower;

// Lights
#define MAX_LIGHTS 32

uniform vec2 directionalLightDir;
uniform vec4 directionalLightColor;
uniform vec3 lightPosition[MAX_LIGHTS];
uniform vec4 lightColor[MAX_LIGHTS];
uniform float lightSize[MAX_LIGHTS];
uniform float lightVolumetric[MAX_LIGHTS];
uniform float lightBloomSize[MAX_LIGHTS];
uniform vec4 lightBloomColor[MAX_LIGHTS];
uniform float lightBloomSmoothStep[MAX_LIGHTS];
uniform bool lightActive[MAX_LIGHTS];

// Volumetric Lights
#define MAX_VOLUMETRICS 16
#define MAX_VOLUMETRIC_EDGES 16

uniform int volumetricType[MAX_VOLUMETRICS];
uniform vec2 volumetricPosition[MAX_VOLUMETRICS];
uniform vec2 volumetricSize[MAX_VOLUMETRICS];
uniform float volumetricAngle[MAX_VOLUMETRICS];
uniform bool volumetricActive[MAX_VOLUMETRICS];

uniform vec4 volumetricEdge0[MAX_VOLUMETRICS];
uniform bool volumetricActiveEdge0[MAX_VOLUMETRICS];
uniform vec4 volumetricEdge1[MAX_VOLUMETRICS];
uniform bool volumetricActiveEdge1[MAX_VOLUMETRICS];
uniform vec4 volumetricEdge2[MAX_VOLUMETRICS];
uniform bool volumetricActiveEdge2[MAX_VOLUMETRICS];
uniform vec4 volumetricEdge3[MAX_VOLUMETRICS];
uniform bool volumetricActiveEdge3[MAX_VOLUMETRICS];
uniform vec4 volumetricEdge4[MAX_VOLUMETRICS];
uniform bool volumetricActiveEdge4[MAX_VOLUMETRICS];
uniform vec4 volumetricEdge5[MAX_VOLUMETRICS];
uniform bool volumetricActiveEdge5[MAX_VOLUMETRICS];
uniform vec4 volumetricEdge6[MAX_VOLUMETRICS];
uniform bool volumetricActiveEdge6[MAX_VOLUMETRICS];
uniform vec4 volumetricEdge7[MAX_VOLUMETRICS];
uniform bool volumetricActiveEdge7[MAX_VOLUMETRICS];
uniform vec4 volumetricEdge8[MAX_VOLUMETRICS];
uniform bool volumetricActiveEdge8[MAX_VOLUMETRICS];
uniform vec4 volumetricEdge9[MAX_VOLUMETRICS];
uniform bool volumetricActiveEdge9[MAX_VOLUMETRICS];
uniform vec4 volumetricEdge10[MAX_VOLUMETRICS];
uniform bool volumetricActiveEdge10[MAX_VOLUMETRICS];
uniform vec4 volumetricEdge11[MAX_VOLUMETRICS];
uniform bool volumetricActiveEdge11[MAX_VOLUMETRICS];
uniform vec4 volumetricEdge12[MAX_VOLUMETRICS];
uniform bool volumetricActiveEdge12[MAX_VOLUMETRICS];
uniform vec4 volumetricEdge13[MAX_VOLUMETRICS];
uniform bool volumetricActiveEdge13[MAX_VOLUMETRICS];
uniform vec4 volumetricEdge14[MAX_VOLUMETRICS];
uniform bool volumetricActiveEdge14[MAX_VOLUMETRICS];
uniform vec4 volumetricEdge15[MAX_VOLUMETRICS];
uniform bool volumetricActiveEdge15[MAX_VOLUMETRICS];

<PixelUniforms>

<PixelStruct>

<PixelVaryings>

float aspectDistance2D(vec2 position0, vec2 position1) {
    float aspectRatio = screenSize.x/screenSize.y;
    float xDistance = length(position0.x - position1.x);
    float yDistance = length(position0.y - position1.y)/aspectRatio;
    return length(vec2(xDistance, yDistance));
}

vec4 applyWorldLight(vec4 color, vec4 screenCoord, vec2 normal, vec3 lightPosition, vec4 lightColor, float lightSize) {
    float fPower = smoothstep(-.2, 1.0, 1.0-aspectDistance2D(screenCoord.xy, lightPosition.xy/screenSize.xy)/(lightSize/screenSize.x));
    float fNormalPower = 1.0-aspectDistance2D(screenCoord.xy, lightPosition.xy/screenSize.xy)/(lightSize/screenSize.x*3.0);
    float depthPower = max(1.0-(abs(screenCoord.z - lightPosition.z)/4.0), .0)/3.0;
    fPower *= depthPower;
    fNormalPower *= depthPower*1.5;

    vec2 dir = (lightPosition.xy/screenSize.xy) - screenCoord.xy;
    dir = normalize(dir);
    float dotValue = dot(normal.xy, dir.xy);

    vec4 normalColor = mix(
        vec4(1, 1, 1, 1),
        lightColor,
        max(dotValue, 0.0)
    );
    color = mix(color, color*lightColor, max(fPower, 0.0));
    color = mix(color, color*normalColor, max(fNormalPower*3.0*normalPower, 0.0));
    return color;
}

vec4 applyWorldLights(vec4 color, vec2 normal, vec4 screenCoord, bool onlySunLight, bool volumetric) {
    float dotValue = dot(normal.xy, directionalLightDir.xy);
    color.rgb *= mix(
        vec3(1, 1, 1),
        directionalLightColor.rgb,
        max(dotValue, 0.0)
    );

    if(!onlySunLight) {
        for(int i = 0; i < MAX_LIGHTS; i++) {
            if(lightActive[i]) {
                color = applyWorldLight(color, screenCoord, normal, lightPosition[i], lightColor[i], lightSize[i]);
            }
        }
    }

    return color;
}

vec2 rotateNormals(vec2 normals, float rotation) {
    return mat2(cos(rotation), sin(rotation), -sin(rotation), cos(rotation)) * normals;
}

<PixelFunctions>

<PixelShaderCode>

void main() {
    // Diffuse
    vec4 internal_diffuse_top = mix(internal_diffuse_tl, internal_diffuse_tr, mod(<AssignedVariable:Pixel:TEXCOORD0>.x/internal_uw, 1.0));
    vec4 internal_diffuse_bottom = mix(internal_diffuse_bl, internal_diffuse_br, mod(<AssignedVariable:Pixel:TEXCOORD0>.x/internal_uw, 1.0));
    vec4 compiler_pass_Diffuse = mix(internal_diffuse_top, internal_diffuse_bottom, smoothstep(0., 1., mod(<AssignedVariable:Pixel:TEXCOORD0>.y/internal_uh, 1.0)));
    
    // Normals
    vec4 internal_normal = texture2D(normalTexture, vec2(<AssignedVariable:Pixel:TEXCOORD0>.x, <AssignedVariable:Pixel:TEXCOORD0>.y));
    vec2 compiler_pass_Normal = vec2(
        -(internal_normal.x - 0.5)*2.0,
        -(internal_normal.y - 0.5)*2.0
    );

    <PixelStructLoad>

    gl_FragColor = pixelShaderFunction(compiler_<PixelStructName>);
}