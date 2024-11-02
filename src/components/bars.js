import { OrthographicCamera } from '@react-three/drei';

import { Mesh } from '@/components/mesh';

export function Bars() {
    return (
        <>
            <Mesh />
            <OrthographicCamera position={[2, 2, 2]} near={-2000} far={2000} />
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
        </>
    )
}