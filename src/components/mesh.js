'use client';

import { forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';

export const Mesh = forwardRef((props, ref) => {
    const { nodes } = useGLTF('/media/bar.glb');
    const aoTexture = useTexture('/media/ao.png');

    useFrame((state, delta, xrFrame) => {
        // executes 1/frame, so we can just directly morph the ref with a delta
        ref.current.rotation.x += 0.01;
        ref.current.rotation.y += 0.02;
    })

    return (
        <mesh ref={ref} geometry={nodes.Plane002.geometry}>
            <meshPhysicalMaterial roughness={0.75} map={aoTexture} />
        </mesh>
    )
})

Mesh.displayName = 'Mesh';