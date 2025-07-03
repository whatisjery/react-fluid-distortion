import { Environment, MeshTransmissionMaterial } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import { useRef } from 'react';
import { Mesh } from 'three';
import { Fluid } from '../../lib';
import { ThreeTunnel } from './tunel';

import Text from './Text';
import { OPTS } from 'lib/constant';
import { useControls } from 'leva';

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

const Example1 = () => {
    const [config] = useControls('Settings', () => ({
        intensity: {
            value: OPTS.intensity,
            min: 0.0,
            max: 10,
            step: 0.01,
            label: 'intensity',
        },

        force: {
            value: OPTS.force,
            min: 0,
            max: 20,
            step: 0.1,
            label: 'force',
        },

        distortion: {
            value: OPTS.distortion,
            min: 0,
            max: 2,
            step: 0.01,
            label: 'distortion',
        },

        curl: {
            value: OPTS.curl,
            min: 0,
            max: 50,
            step: 0.1,
            label: 'curl',
        },

        swirl: {
            value: OPTS.swirl,
            min: 0,
            max: 20,
            step: 1,
            label: 'swirl',
        },

        fluidColor: {
            value: OPTS.fluidColor,
            label: 'fluid color',
        },

        backgroundColor: {
            value: OPTS.backgroundColor,
            label: 'background color',
        },

        blend: {
            value: OPTS.blend,
            min: 0.0,
            max: 10,
            step: 0.01,
            label: 'blend',
        },

        showBackground: {
            value: OPTS.showBackground,
            label: 'show background',
        },

        rainbow: {
            value: true,
            label: 'rainbow mode',
        },

        pressure: {
            value: OPTS.pressure,
            min: 0,
            max: 1,
            step: 0.01,
            label: 'pressure reduction',
        },

        densityDissipation: {
            value: OPTS.densityDissipation,
            min: 0,
            max: 1,
            step: 0.01,
            label: 'density dissipation',
        },

        velocityDissipation: {
            value: OPTS.velocityDissipation,
            min: 0,
            max: 1,
            step: 0.01,
            label: 'velocity dissipation',
        },

        radius: {
            value: OPTS.radius,
            min: 0.01,
            max: 1,
            step: 0.01,
            label: 'radius',
        },
    }));

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

export default Example1;
