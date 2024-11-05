'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Object3D } from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

import { Material } from '@/components/material';

export const Mesh = forwardRef((props, ref) => {
    const instanceMeshRef = useRef();
    const materialRef = useRef();

    useImperativeHandle(ref, () => ({
        iMesh: instanceMeshRef.current,
        material: materialRef.current
    }));

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
    const instancePositions = [];

    for (let i = 0; i < iSize; i++) {
        for (let j = 0; j < iSize; j++) {
            d.position.set(
                width * (i - iSize / 2),
                0,
                width * (j - iSize / 2)
            );
            d.updateMatrix();
            positions.push(...d.matrix.elements);

            // create an array for UVs
            instancePositions.push(i / iSize, j / iSize);
        }
    }
    const instanceLocMatrixPositions = new Float32Array(positions);
    const instanceUV = new Float32Array(instancePositions);

    useFrame((state, delta, xrFrame) => {
        // executes 1/frame, so we can just directly morph the ref with a delta
        // ref.current.rotation.x += 0.01;
        // ref.current.rotation.y += 0.02;
    })

    return (
        <instancedMesh ref={instanceMeshRef} geometry={instanceGeometry} count={instances} {...props}>
            <Material ref={materialRef} />
            <instancedBufferAttribute attach={'instanceMatrix'} args={[instanceLocMatrixPositions, 16]} />
            <instancedBufferAttribute attach={'geometry-attributes-instanceUV'} args={[instanceUV, 2]} />
        </instancedMesh>
    )
})

Mesh.displayName = 'Mesh';