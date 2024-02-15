import { Fluid } from '../../lib/Fluid';
import { EffectComposer } from '@react-three/postprocessing';
import { useTexture } from '@react-three/drei';
import { ThreeTunnel } from './tunel';

import img from '@/assets/img.jpg';
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

const Exemple1 = () => {
    return (
        <ThreeTunnel.In>
            <Text />
            <Image />

            <EffectComposer>
                <Fluid />
            </EffectComposer>
        </ThreeTunnel.In>
    );
};

export default Exemple1;
