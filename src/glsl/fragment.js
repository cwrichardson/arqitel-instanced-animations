export const fragment = /* glsl */ `
    uniform float uProgress;
    uniform sampler2D uState1;
    uniform sampler2D uState2;
    varying vec2 vUv;

    void main() {
        // gl_FragColor = vec4(vUv, 0., 1.);
        // gl_FragColor = vec4(1.0, 0., 0., 1.);
        vec4 color = texture2D(uState1, vUv);
        vec4 color2 = texture2D(uState2, vec2(vUv.x, 1. - vUv.y));

        vec4 finalColor = mix(color, color2, uProgress);
        gl_FragColor = finalColor;
    }
`;