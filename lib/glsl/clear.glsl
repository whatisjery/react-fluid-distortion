precision highp float;

varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uClearValue;

void main() {
    gl_FragColor = uClearValue * texture2D(uTexture, vUv);
}