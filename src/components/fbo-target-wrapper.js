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
    const cam = useRef(null);

    const scene = useMemo(() => {
        const scene = new Scene();
        return scene;
    }, []);

    useFrame((state) => {
        // cam.current.position.z = 5 + Math.sin(state.clock.getElapsedTime() * 1.5) * 2;
        state.gl.setRenderTarget(target);
        state.gl.render(scene, cam.current);
        state.gl.setRenderTarget(null);
    });

    return (
        <>
            <OrthographicCamera
              makeDefault
              ref={cam}
              args={[-1, 1, 1, -1]}
              near={-1}
              far={1}
            //   @todo figure out why we need to set this zoom
              zoom={700}
            />
            {createPortal(<Bars />, scene)}
            <mesh>
                <planeGeometry width={2} height={2} />
                <customMaterial map={target?.texture} />
            </mesh>
        </>
    )
}