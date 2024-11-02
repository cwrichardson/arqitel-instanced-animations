import { Fbo } from '@react-three/drei';

import { TargetWrapper } from '@/components/fbo-target-wrapper';

export function FboScene(props) {
    return <Fbo {...props}>{(target) => <TargetWrapper target={target} />}</Fbo>
}