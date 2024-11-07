export const fragment = /* glsl */ `
    uniform float uProgress;
    uniform sampler2D uState1;
    uniform sampler2D uState2;
    varying vec2 vUv;

    void main() {
        // gl_FragColor = vec4(vUv, 0., 1.);
        // gl_FragColor = vec4(1.0, 0., 0., 1.);
        vec4 color = texture2D(uState1, vUv + vec2(0.0, 0.3));
        gl_FragColor = color;
    }
`;