import { useMemo, useRef } from 'react';
import { Scene } from 'three';
import { createPortal, extend, useFrame } from '@react-three/fiber';
import { OrthographicCamera, shaderMaterial } from '@react-three/drei';

import { vertex } from '@/glsl/vertex';
import { fragment } from '@/glsl/fragment';
import { Bars } from '@/components/bars';

const CustomMaterial = shaderMaterial({
    uProgress: 1,
    uTime: 0
}, vertex, fragment);
extend({ CustomMaterial });

export function TargetWrapper({ target }) {
    const barsSceneRef = useRef();
    const parentMaterialRef = useRef();

    const FBOScene = useMemo(() => {
        const scene = new Scene();
        return scene;
    }, []);

    useFrame((state) => {
        if (barsSceneRef.current.camera) {
            state.gl.setRenderTarget(target);
            state.gl.render(FBOScene, barsSceneRef.current.camera);
            state.gl.setRenderTarget(null);
        }
    });

    return (
        <>
            {createPortal(<Bars ref={barsSceneRef} />, FBOScene)}
            <OrthographicCamera
              makeDefault
              args={[-1, 1, 1, -1]}
              near={-1}
              far={1}
            //   @todo figure out why we need to set this zoom
              zoom={700}
            />
            <mesh>
                <planeGeometry width={2} height={2} />
                <customMaterial ref={parentMaterialRef} />
            </mesh>
        </>
    )
}