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

    return (
        <View orbit {...props}>
            <Suspense fallback={null}>
                <Mesh
                  ref={meshRef} />
                <OrthographicCamera makeDefault position={[2, 2, 2]} zoom={240} />
                <ambientLight color={0xffffff} intensity={0.7} />
                {/* <directionalLight intensity={0.5} position={[0.5, 0, 0.866]} /> /* ~60º */}
            </Suspense>
        </View>
    )
}