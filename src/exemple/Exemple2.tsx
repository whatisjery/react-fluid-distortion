import { useRef } from 'react';
import { Mesh } from 'three';
import { useFrame } from '@react-three/fiber';
import { Fluid, useConfig } from '../../lib';
import { EffectComposer } from '@react-three/postprocessing';
import { Environment, MeshTransmissionMaterial } from '@react-three/drei';
import { ThreeTunnel } from './tunel';

import Text from './Text';

const Torus = () => {
    const meshRef = useRef<Mesh>(null);

    useFrame(() => {
        if (!meshRef.current) return;

        meshRef.current.rotation.y += 0.01;
        meshRef.current.rotation.x += 0.005;
    });
    return (
        <>
            <ambientLight intensity={10.1} />
            <directionalLight position={[2, 20, 10]} />
            <Environment preset='warehouse' />

            <mesh position-z={-4} ref={meshRef}>
                <torusGeometry attach='geometry' args={[2.8, 0.8, 100, 100]} />

                <MeshTransmissionMaterial
                    transmission={1}
                    samples={1}
                    anisotropy={0}
                    chromaticAberration={0}
                />
            </mesh>
        </>
    );
};

const Exemple2 = () => {
    const config = useConfig();
    return (
        <ThreeTunnel.In>
            <Text />
            <Torus />

            <EffectComposer>
                <Fluid {...config} />
            </EffectComposer>
        </ThreeTunnel.In>
    );
};

export default Exemple2;
