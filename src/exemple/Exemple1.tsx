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
                <planeGeometry args={[7, 10, 20, 20]} attach='geometry' />
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
                <Fluid
                    velocityDissipation={1.0}
                    densityDissipation={0.98}
                    pressure={0.8}
                    rainbow={false}
                    blend={5}
                    backgroundColor='#070410'
                    fluidColor='#3300ff'
                    distortion={0.4}
                    swirl={4}
                    curl={1.9}
                    force={1.1}
                    intensity={2}
                />
            </EffectComposer>
        </ThreeTunnel.In>
    );
};

export default Exemple1;
