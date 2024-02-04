uniform sampler2D tFluid;

uniform vec3 uColor;
uniform vec3 uBackground;

uniform float uDistort;
uniform float uPresence;
uniform float uRainbow;
uniform float uBlend;
uniform float uBackgroundAlpha;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

    vec3 fluidColor = texture2D(tFluid, uv).rgb;

    vec2 distortedUv = uv - fluidColor.rg * uDistort;

    vec4 texture = texture2D(inputBuffer, distortedUv);

    float fluidPresence = length(fluidColor) * uPresence;

    vec3 selectedColor = uColor * length(fluidColor);

    vec4 colorForFluidEffect = vec4(uRainbow == 1.0 ? fluidColor : selectedColor, 1.0);

    vec4 computedBgColor = vec4(uBackground, uBackgroundAlpha);

    vec4 computedFluidColor = mix(texture, colorForFluidEffect, uBlend);

    vec4 finalColor;

    if(texture.a < 0.1) {
        finalColor = mix(computedBgColor, colorForFluidEffect, fluidPresence);
    } else {
        finalColor = mix(computedFluidColor, computedBgColor, 1.0 - texture.a);
    }

    outputColor = finalColor;
}