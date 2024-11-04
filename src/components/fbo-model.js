'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { extend } from '@react-three/fiber';
import {
    OrthographicCamera,
    shaderMaterial,
    useTexture
} from '@react-three/drei';
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
        <>
            <OrthographicCamera
              ref={cameraRef}
              args={[-1, 1, 1, -1]}
              near={-1}
              far={1}
            //   @todo figure out why we need to set this zoom
              zoom={700}
            />
            <mesh ref={meshRef} {...props}>
                <planeGeometry width={2} height={2} />
                <customMaterial
                  uProgress={0}
                  uState1={squareTexture}
                  uState2={uaTexture}
                />
            </mesh>
        </>
    )
})

FboModel.displayName = 'FboModel';