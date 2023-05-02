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

bool rayLineIntersect:PIXEL(float a, float b, float c, float d, float p, float q, float r, float s) {
    float det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if(det == 0.0) return false;
    else {
        lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
        gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
        return (0.0 < lambda && lambda < 1.0) && (0.0 < gamma && gamma < 1.0);
    }
}

bool lineBoxIntersection:PIXEL(vec2 rayStart, vec2 rayEnd, vec2 boxStart, vec2 boxSize, float angle) {
    vec2 v0 = boxStart.xy;
    vec2 v1 = boxStart.xy + vec2(sin(angle + PI/2.0) * boxSize.x, cos(angle + PI/2.0) * boxSize.x);
    vec2 v2 = boxStart.xy + vec2(sin(angle) * boxSize.y, cos(angle) * boxSize.y);
    vec2 v3 = v1.xy + vec2(sin(angle) * boxSize.y, cos(angle) * boxSize.y);
    
    return (
        rayLineIntersect(rayStart.x, rayStart.y, rayEnd.x, rayEnd.y, v0.x, v0.y, v1.x, v1.y) ||
        rayLineIntersect(rayStart.x, rayStart.y, rayEnd.x, rayEnd.y, v0.x, v0.y, v2.x, v2.y) ||
        rayLineIntersect(rayStart.x, rayStart.y, rayEnd.x, rayEnd.y, v2.x, v2.y, v3.x, v3.y) ||
        rayLineIntersect(rayStart.x, rayStart.y, rayEnd.x, rayEnd.y, v1.x, v1.y, v3.x, v3.y)
    );
}

bool lineSphereIntersect:PIXEL(vec2 rayStart, vec2 rayEnd, vec2 spherePos, float sphereRadius) {
    vec2 rayDir = normalize(rayEnd - rayStart);
    vec2 L = spherePos - rayStart;
    float tca = dot(L, rayDir);
    float d2 = dot(L, L) - tca * tca;
    float radius2 = sphereRadius * sphereRadius;
    if (d2 > radius2) {
        return false;
    }
    float thc = sqrt(radius2 - d2);
    float t0 = tca - thc;
    float t1 = tca + thc;
    if (t0 > t1) {
        float tmp = t0;
        t0 = t1;
        t1 = tmp;
    }
    float rayLen = length(rayEnd - rayStart);
    if (t1 < 0.0 || t0 > rayLen) {
        return false;
    }
    return true;
}

PSInput vertexShaderFunction(VSInput VS) {
    PSInput PS;

    PS.Position = VS.Matrix * VS.Position;

    PS.ScreenCoord.xy = (PS.Position.xy+1.0)/2.0;
    PS.ScreenCoord.y = 1.0-PS.ScreenCoord.y;

    return PS;
}

vec4 doubleMix:PIXEL(vec4 a, vec4 b, vec4 c, float n, float t) {
    return mix(a, c, t);
}

vec4 pixelShaderFunction(PSInput PS) {
    PS.Diffuse = applyWorldLights(PS.Diffuse, PS.Normal, PS.ScreenCoord, false, false);

    vec4 outColor = vec4(0, 0, 0, 0);
    for(int i = 0; i < MAX_LIGHTS; i++) {
        if(lightActive[i]) {
            float fPower = 1.0-aspectDistance2D(PS.ScreenCoord.xy, lightPosition[i].xy/screenSize.xy)/(lightBloomSize[i]/screenSize.x);
            float f = smoothstep(lightBloomSmoothStep[i], 1.0, 1.0-max(fPower, 0.0));
            vec4 color = mix(lightBloomColor[i], lightColor[i], .3+f/2.0);
            outColor = mix(color*lightBloomColor[i].a, outColor, f);
        }
    }

    return outColor;
}