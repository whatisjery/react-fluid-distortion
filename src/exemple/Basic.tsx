import { Canvas } from '@react-three/fiber';
import { Fluid, useConfig } from '@/index';

import { EffectComposer } from '@react-three/postprocessing';

const Basic = () => {
    const config = useConfig();
    return (
        <Canvas
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100vh',
                width: '100vw',
            }}
        >
            <mesh>
                <boxGeometry args={[3, 3, 1]} />
                <meshBasicMaterial color="red"></meshBasicMaterial>
            </mesh>

            <EffectComposer>
                <Fluid {...config} />
            </EffectComposer>
        </Canvas>
    );
};

export default Basic;
