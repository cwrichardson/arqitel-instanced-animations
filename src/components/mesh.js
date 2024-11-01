'use client';

import { forwardRef, Suspense } from 'react';
import { Object3D } from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';

/**
 * Put materials into its own component, and wrap it in suspense in the mesh
 * to avoid weird race conditions.
 */
const Material = () => {
    const aoTexture = useTexture('/media/ao.png');
    aoTexture.flipY = false;

    return (
        <meshPhysicalMaterial
            roughness={0.65}
            map={aoTexture}
            aoMap={aoTexture}
            aoMapIntensity={0.75}
        />
    )
}

export const Mesh = forwardRef((props, ref) => {

    // instance geometry
    const { nodes } = useGLTF('/media/bar.glb');
    const barGeometry = nodes.Plane002.geometry;
    const instanceGeometry = barGeometry.scale(40, 40, 40);

    // instances
    const iSize = 50;
    const instances = iSize**2;

    /**
     * To set the position of each instance, `instanceBufferAttribute`
     * needs a Matrix4 for each one. The "local matrix" we're passing
     * is pretty simple:
     *      1 0 0 0
     *      0 1 0 0
     *      0 0 1 0
     *      x y z 1
     * 
     * but in case we need to do some fancier transforms later, we use
     * the helper functions of `Object3D` to create the matrix for us.
     * 
     * We did a `scale` on the underlying geometry of 40, so we use a
     * width of 60 to position each instance with a little space.
     */
    const d = new Object3D();
    const width = 60;
    const positions = [];

    for (let i = 0; i < iSize; i++) {
        for (let j = 0; j < iSize; j++) {
            d.position.set(
                width * (i - iSize / 2),
                0,
                width * (j - iSize / 2)
            );
            d.updateMatrix();
            positions.push(...d.matrix.elements);
        }
    }
    const instanceLocMatrixPositions = new Float32Array(positions);

    useFrame((state, delta, xrFrame) => {
        // executes 1/frame, so we can just directly morph the ref with a delta
        // ref.current.rotation.x += 0.01;
        // ref.current.rotation.y += 0.02;
    })

    return (
        <instancedMesh ref={ref} geometry={instanceGeometry} count={instances}>
            <Suspense fallback={null}>
                <Material />
            </Suspense>
            <instancedBufferAttribute attach={'instanceMatrix'} args={[instanceLocMatrixPositions, 16]} />
        </instancedMesh>
    )
})

Mesh.displayName = 'Mesh';