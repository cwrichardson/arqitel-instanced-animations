import { forwardRef, useImperativeHandle, useRef } from 'react';
import {
    GizmoHelper,
    GizmoViewport,
    Grid,
    OrthographicCamera
} from '@react-three/drei';

import { Mesh } from '@/components/mesh';

export const Bars = forwardRef((props, ref) => {
    const meshRef = useRef();
    const cameraRef = useRef();

    useImperativeHandle(ref, () => ({
        camera: cameraRef.current,
        mesh: meshRef.current
    }));

    return (
        <>
            <Mesh ref={meshRef} {...props} />
            <OrthographicCamera
                ref={cameraRef}
                position={[2, 2, 2]}
                near={-2000}
                far={2000}
                makeDefault
            />
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
            <Grid
                position={[0, -0.01, 0]}
                sectionSize={10}
                cellColor={0xffffff}
                infiniteGrid
            />
            <GizmoHelper alignment='bottom-right' margin={[80, 80]}>
                <GizmoViewport />
            </GizmoHelper>
        </>
    )
})

Bars.displayName = 'Bars';