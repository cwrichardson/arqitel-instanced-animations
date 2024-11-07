'use client';

import {
    forwardRef,
    useImperativeHandle,
    useMemo,
    useRef
} from 'react';
import { useFrame } from '@react-three/fiber';
import { Instance, Instances, useGLTF } from '@react-three/drei';

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

    // instances
    const iSize = 50;

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
    const width = 60;
    
    const [instances, instanceUVs] = useMemo(() => {
        let instances = [];
        let instanceUVs = [];

        for (let i = 0; i < iSize; i++) {
            for (let j = 0; j < iSize; j++) {
                const position = [
                    width * (i - iSize / 2),
                    0,
                    width * (j - iSize / 2)
                ];
                instances.push({position});
    
                // create an array for UVs
                instanceUVs.push(i / iSize, j / iSize);
            }
        }

        return [instances, new Float32Array(instanceUVs)];
    }, [width, iSize]);

    useFrame((state, delta, xrFrame) => {
        // executes 1/frame, so we can just directly morph the ref with a delta
        // ref.current.rotation.x += 0.01;
        // ref.current.rotation.y += 0.02;
    })

    return (
        <Instances ref={instanceMeshRef} limit={iSize**2} {...props}>
            <bufferGeometry {...barGeometry} />
            <Material ref={materialRef} />
            <instancedBufferAttribute
                attach={'geometry-attributes-instanceUV'}
                args={[instanceUVs, 2]}
            />
            {instances.map((instance, i) => 
                <Instance
                  key={i}
                  scale={40}
                  position={instance.position}
                />
            )}
        </Instances>
    )
})

Mesh.displayName = 'Mesh';