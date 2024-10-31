'use client';

import dynamic from 'next/dynamic';
import { Suspense, useMemo, useRef } from 'react';
import { PerspectiveCamera } from '@react-three/drei';

import { Points } from '@/components/points';

const View = dynamic(() => import('src/components/view')
    .then((mod) => mod.View), {
        ssr: false
    }
);

export function Model(props) {
    const meshRef = useRef();
    const rows = 512;
    const columns = 512;
    const halfColumns = Math.floor(columns / 2);
    const halfRows = Math.floor(rows / 2);
    
    const [ vertices, locationCoords ] = useMemo(() => {
        const positions = [];
        const coordinates = [];
        for (let x = 0; x < columns; x++ ) {
            // center x
            const posX = x - halfColumns;
            for ( let y = 0; y < rows; y++ ) {
                // center y
                positions.push(posX * 2, (y - halfRows) * 2, 0);
                coordinates.push(x/columns,y/rows);
            }
        }

        return [
            new Float32Array(positions),
            new Float32Array(coordinates)
        ];
    }, [halfColumns, halfRows])


    return (
        <View orbit {...props}>
            <Suspense fallback={null}>
                <Points
                  vertices={vertices}
                  positions={locationCoords}
                  ref={meshRef} />
                <PerspectiveCamera
                  makeDefault
                  near={0.1}
                  far={3000}
                  position={[0, 0, 1000]} />
                  {/* <ambientLight intensity={0.5} />
                  <directionalLight intensity={0.5} position={[0.5, 0, 0.866]} /> {/* ~60º */}
            </Suspense>
        </View>
    )
}