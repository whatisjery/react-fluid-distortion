import { Fluid } from '../../lib';
import { EffectComposer } from '@react-three/postprocessing';
import { useTexture } from '@react-three/drei';
import { ThreeTunnel } from './tunel';

import img from '@/assets/img2.jpg';

import Text from './Text';

const Image = () => {
    const texture = useTexture(img);

    return (
        <mesh position-z={-4}>
            <planeGeometry args={[7, 10, 20, 20]} attach='geometry' />
            <meshBasicMaterial map={texture} color='#d5cfc9' />
        </mesh>
    );
};

const Exemple3 = () => {
    return (
        <ThreeTunnel.In>
            <Text />
            <Image />

            <EffectComposer>
                <Fluid
                    radius={0.03}
                    curl={10}
                    swirl={5}
                    distortion={1}
                    force={2}
                    pressure={0.94}
                    densityDissipation={0.98}
                    velocityDissipation={0.99}
                    intensity={0.3}
                    rainbow={false}
                    blend={0}
                    showBackground={true}
                    backgroundColor='#a7958b'
                    fluidColor='#cfc0a8'
                />
            </EffectComposer>
        </ThreeTunnel.In>
    );
};

export default Exemple3;
