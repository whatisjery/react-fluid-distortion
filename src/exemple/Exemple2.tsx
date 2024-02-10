import { Fluid } from '@/index';
import { EffectComposer } from '@react-three/postprocessing';
import { useTexture } from '@react-three/drei';
import { ThreeTunnel } from './tunel';

import img from '@/assets/img.jpg';
import Text from './Text';

const Box = () => {
    const texture = useTexture(img);
    return (
        <>
            <mesh position-z={-4}>
                <planeGeometry args={[6, 9, 20, 20]} attach='geometry' />
                <meshBasicMaterial map={texture} />
            </mesh>
        </>
    );
};

const Exemple1 = () => {
    return (
        <ThreeTunnel.In>
            <Text />

            <Box />

            <EffectComposer>
                <Fluid />
            </EffectComposer>
        </ThreeTunnel.In>
    );
};

export default Exemple1;
