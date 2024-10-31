export const vertex = /* glsl */ `
    uniform float uProgress;
    uniform float uTime;
    attribute vec2 aCoords;
    varying vec2 vUv;

    void main() {
        vUv = aCoords;

        vec4 mvPosition = uProgress * modelViewMatrix * vec4( position, 1. );
        // start with big particles; give them some perspective
        gl_PointSize = 200. * ( 1. / - mvPosition.z );
        gl_Position = projectionMatrix * mvPosition;
    }
`;