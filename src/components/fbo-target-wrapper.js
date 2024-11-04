import { useMemo, useRef } from 'react';
import { Scene, Texture } from 'three';
import { createPortal, extend, useFrame } from '@react-three/fiber';
import { OrthographicCamera, shaderMaterial, useTexture } from '@react-three/drei';

import { vertex } from '@/glsl/vertex';
import { fragment } from '@/glsl/fragment';
import { Bars } from '@/components/bars';
import { useControls } from 'leva';

const CustomMaterial = shaderMaterial({
    uProgress: 0,
    uState1: new Texture(),
    uState2: new Texture(),
    uTime: 0
}, vertex, fragment);
extend({ CustomMaterial });

export function TargetWrapper({ target }) {
    const barsSceneRef = useRef();
    const parentMaterialRef = useRef();

    // for the square texture, we re-use the texture-mask-graph
    // (he made a copy in the video, and changed it to b&w, but
    // ours already is)
    const squareTexture = useTexture('/media/texture-mask-graph.png');
    const uaTexture = useTexture('/media/ua-pop.png');

    useControls({
        progress: {
            value: 0,
            min: 0,
            max: 0,
            onChange: (v) => {
                parentMaterialRef.current.uProgress = v;
            }
        }
    })

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
                <customMaterial
                  ref={parentMaterialRef}
                  uState1={squareTexture}
                  uState2={uaTexture}
                />
            </mesh>
        </>
    )
}