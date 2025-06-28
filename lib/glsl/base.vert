#ifdef USE_V_UV
  varying vec2 vUv;
#endif

#ifdef USE_OFFSETS
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform vec2 texelSize;
#endif

void main() {
  #ifdef USE_V_UV
    vUv = uv;
  #endif

  #ifdef USE_OFFSETS
    vL = uv - vec2(texelSize.x, 0.0);
    vR = uv + vec2(texelSize.x, 0.0);
    vT = uv + vec2(0.0, texelSize.y);
    vB = uv - vec2(0.0, texelSize.y);
  #endif

  gl_Position = vec4(position, 1.0);
}