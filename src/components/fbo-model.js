'use client';

import {
    forwardRef,
    Suspense,
    useImperativeHandle,
    useRef
} from 'react';
import { extend } from '@react-three/fiber';
import { shaderMaterial, useTexture } from '@react-three/drei';
import { Texture } from 'three';

import { vertex } from '@/glsl/vertex';
import { fragment } from '@/glsl/fragment';

const CustomMaterial = shaderMaterial({
    uProgress: 0,
    uState1: new Texture(),
    uState2: new Texture(),
    uTime: 0
}, vertex, fragment);
extend({ CustomMaterial });

/**
 * The model we're rendering into the frame buffer target
 * (e.g., square, map, etc...)
 */
export const FboModel = forwardRef((props, ref) => {
    const cameraRef = useRef();
    const meshRef = useRef();

    useImperativeHandle(ref, () => ({
        camera: cameraRef.current,
        mesh: meshRef.current
    }));

    // for the square texture, we re-use the texture-mask-graph
    // (he made a copy in the video, and changed it to b&w, but
    // ours already is)
    const squareTexture = useTexture('/media/texture-mask-graph.png');
    const uaTexture = useTexture('/media/ua-pop.png');

    return (
        <Suspense fallback={null}>
            <orthographicCamera
              ref={cameraRef}
              args={[-1, 1, 1, -1, 0, 1]}
            />
            <mesh ref={meshRef} {...props}>
                <planeGeometry args={[2, 2]} />
                <customMaterial
                  uProgress={0}
                  uState1={squareTexture}
                  uState2={uaTexture}
                />
            </mesh>
        </Suspense>
    )
})

FboModel.displayName = 'FboModel';