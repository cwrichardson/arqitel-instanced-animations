import { useMemo, useRef } from 'react';
import { Scene, Texture } from 'three';
import { createPortal, extend, useFrame } from '@react-three/fiber';
import { OrthographicCamera, shaderMaterial, useTexture } from '@react-three/drei';
import { useControls } from 'leva';

import { Bars } from '@/components/bars';
import { FboModel } from './fbo-model';

export function TargetWrapper({ target }) {
    const fboModelRef = useRef();
    const mainRef = useRef();

    useControls({
        progress: {
            value: 0,
            min: 0,
            max: 0,
            onChange: (v) => {
                fboModelRef.current.mesh.material.uProgress = v;
            }
        }
    })

    const FBOScene = useMemo(() => {
        const scene = new Scene();
        return scene;
    }, []);

    useFrame((state) => {
        if (fboModelRef.current.camera) {
            state.gl.setRenderTarget(target);
            state.gl.render(FBOScene, fboModelRef.current.camera);
            state.gl.setRenderTarget(null);
        }
        mainRef.current.mesh.material.uFBO = target.texture;
    });

    return (
        <>
            {createPortal(<FboModel ref={fboModelRef} />, FBOScene)}
            <Bars ref={mainRef} />
        </>
    )
}