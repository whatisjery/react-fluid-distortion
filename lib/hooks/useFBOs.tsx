import * as THREE from 'three';

import { useFBO } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import { useDoubleFBO } from '../hooks/useDoubleFBO';
import { DEFAULT_CONFIG } from '../constant';

export const useFBOs = () => {
    const density = useDoubleFBO(DEFAULT_CONFIG.dyeRes, DEFAULT_CONFIG.dyeRes, {
        type: THREE.HalfFloatType,
        format: THREE.RGBAFormat,
        minFilter: THREE.LinearFilter,
        depthBuffer: false,
    });

    const velocity = useDoubleFBO(DEFAULT_CONFIG.simRes, DEFAULT_CONFIG.simRes, {
        type: THREE.HalfFloatType,
        format: THREE.RGFormat,
        minFilter: THREE.LinearFilter,
        depthBuffer: false,
    });

    const pressure = useDoubleFBO(DEFAULT_CONFIG.simRes, DEFAULT_CONFIG.simRes, {
        type: THREE.HalfFloatType,
        format: THREE.RedFormat,
        minFilter: THREE.NearestFilter,
        depthBuffer: false,
    });

    const divergence = useFBO(DEFAULT_CONFIG.simRes, DEFAULT_CONFIG.simRes, {
        type: THREE.HalfFloatType,
        format: THREE.RedFormat,
        minFilter: THREE.NearestFilter,
        depthBuffer: false,
    });

    const curl = useFBO(DEFAULT_CONFIG.simRes, DEFAULT_CONFIG.simRes, {
        type: THREE.HalfFloatType,
        format: THREE.RedFormat,
        minFilter: THREE.NearestFilter,
        depthBuffer: false,
    });

    const FBOs = useMemo(() => {
        return {
            density,
            velocity,
            pressure,
            divergence,
            curl,
        };
    }, [curl, density, divergence, pressure, velocity]);

    useEffect(() => {
        for (const FBO of Object.values(FBOs)) {
            if ('write' in FBO) {
                FBO.setGenerateMipmaps(false);
            } else {
                FBO.texture.generateMipmaps = false;
            }
        }

        return () => {
            for (const FBO of Object.values(FBOs)) {
                FBO.dispose();
            }
        };
    }, [FBOs]);

    return FBOs;
};
