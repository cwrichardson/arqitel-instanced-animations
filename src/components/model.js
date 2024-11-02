'use client';

import dynamic from 'next/dynamic';
import { Suspense, useRef } from 'react';

import { FboScene } from '@/components/fbo-scene';

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
                <FboScene />
            </Suspense>
        </View>
    )
}