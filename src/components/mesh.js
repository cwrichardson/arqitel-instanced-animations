'use client';

import { forwardRef, useRef } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { shaderMaterial, useGLTF } from '@react-three/drei';
import { DoubleSide } from 'three';
import { useControls } from 'leva';

import { vertex } from '@/glsl/vertex';
import { fragment } from '@/glsl/fragment';

const CustomMaterial = shaderMaterial({
    uProgress: 1,
    uTime: 0
}, vertex, fragment);
extend({ CustomMaterial });

export const Mesh = forwardRef((props, ref) => {
    const { vertices, positions } = props;
    const shaderRef = useRef();

    const { nodes } = useGLTF('/media/bar.glb');

    /**
     * Use leva controls
     */
    const { progress } = useControls({
        progress: {
            value: 1,
            min: 0,
            max: 1,
            onChange: (v) => {
                shaderRef.current.uProgress = v;
            }
        }
    })

    useFrame((state, delta, xrFrame) => {
        // do animation
        // shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;

        // executes 1/frame, so we can just directly morph the ref with a delta
        ref.current.rotation.x += 0.01;
        ref.current.rotation.y += 0.02;
    })

    return (
        <mesh ref={ref} geometry={nodes.Plane002.geometry}>
            <customMaterial
              ref={shaderRef}
              extensions={{ derivatives: "#extension GL_OES_standard_derivatives : enable"}}
              uProgress={1}
              uTime={0}
              vertexShader={vertex}
              fragmentShader={fragment}
              depthTest={false}
            />
        </mesh>
    )
})

Mesh.displayName = 'Mesh';