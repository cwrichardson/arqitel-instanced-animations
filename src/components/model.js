'use client';

import dynamic from 'next/dynamic';
import { Suspense, useRef } from 'react';
import { OrthographicCamera } from '@react-three/drei';

import { Mesh } from '@/components/mesh';

const View = dynamic(() => import('src/components/view')
    .then((mod) => mod.View), {
        ssr: false
    }
);

export function Model(props) {
    const meshRef = useRef();
    const slTargetRef = useRef();

    return (
        <View orbit {...props}>
            <Suspense fallback={null}>
                <Mesh
                  ref={meshRef} />
                <OrthographicCamera makeDefault position={[2, 2, 2]} near={-2000} far={2000} />
                <ambientLight color={0xffffff} intensity={0.7} />
                <spotLight
                  angle={1}
                  color={0xffe9e9}
                  decay={0.7}
                  distance={3000}
                  intensity={300}
                  penumbra={1.5}
                  position={[-80, 200, -80]}
                  target-position={[0, -80, 200]}
                />
            </Suspense>
        </View>
    )
}