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

        float dist = distance(vUv, vec2(0.5));
        // sqrt(2) ?
        float radius = 1.41;
        float outer_progress = clamp(1.1 * uProgress, 0., 1.);
        float inner_progress = clamp(1.1 * uProgress - 0.05, 0., 1.);

        float innerCircle = 1. - smoothstep(
            (inner_progress - 0.1) * radius,
            (inner_progress) * radius,
            dist
        );
        float outerCircle = 1. - smoothstep(
            (outer_progress - 0.1) * radius,
            (outer_progress) * radius,
            dist
        );

        float displacement = outerCircle - innerCircle;
        float scale = mix(color.r, color2.r, innerCircle);

        vec4 finalColor = mix(color, color2, uProgress);
        gl_FragColor = finalColor;
        // gl_FragColor = vec4(vec3(innerCircle, outerCircle, 0.), 1.);
        gl_FragColor = vec4(vec3(scale), 1.);
    }
`;