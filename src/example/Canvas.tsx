import { Canvas as R3fCanvas } from '@react-three/fiber';
import { ThreeTunnel } from './tunel';
import { Suspense } from 'react';

const Canvas = () => {
    return (
        <R3fCanvas
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100vh',
                width: '100vw',
            }}>
            <Suspense fallback={null}>
                <ThreeTunnel.Out />
            </Suspense>
        </R3fCanvas>
    );
};

export default Canvas;
