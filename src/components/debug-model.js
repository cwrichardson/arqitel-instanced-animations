export function Debug({fboTarget}) {

    return (
        <mesh position={[0, 150, 0]}>
            <planeGeometry args={[100, 100]} />
            <meshBasicMaterial map={fboTarget.texture} />
        </mesh>
    )
}