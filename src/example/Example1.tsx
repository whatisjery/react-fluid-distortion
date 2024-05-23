import { useTexture } from '@react-three/drei';
import { EffectComposer } from '@react-three/postprocessing';
import { Fluid } from '../../lib/Fluid';
import { ThreeTunnel } from './tunel';

import img from '@/assets/img.jpg';
import { useEffect, useState } from 'react';
import Text from './Text';

const Image = () => {
    const texture = useTexture(img);

    return (
        <mesh position-z={-4}>
            <planeGeometry args={[7, 10, 20, 20]} attach='geometry' />
            <meshBasicMaterial map={texture} color='#c4b4d2' />
        </mesh>
    );
};

const Example1 = () => {
    const [ref, setRef] = useState<any>(null);
    useEffect(() => {
        document.addEventListener('pointermove', ref?.onPointerMove);
        return () => {
            document.removeEventListener('pointermove', ref?.onPointerMove);
        };
    }, [ref]);
    return (
        <ThreeTunnel.In>
            <Text />
            <Image />
            <EffectComposer>
                <Fluid ref={setRef} />
            </EffectComposer>
        </ThreeTunnel.In>
    );
};

export default Example1;
