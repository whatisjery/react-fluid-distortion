import { ShaderMaterial, Texture, Vector2, Vector3 } from 'three';
import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { OPTS } from '../constant';

import baseVertex from '../glsl/base.vert';
import clearFrag from '../glsl/clear.frag';
import curlFrag from '../glsl/curl.frag';
import divergenceFrag from '../glsl/divergence.frag';
import gradientSubstractFrag from '../glsl/gradientSubstract.frag';
import pressureFrag from '../glsl/pressure.frag';
import splatFrag from '../glsl/splat.frag';
import advectionFrag from '../glsl/advection.frag';
import vorticityFrag from '../glsl/vorticity.frag';

export const useMaterials = (): { [key: string]: ShaderMaterial } => {
    const size = useThree((s) => s.size);

    const shaderMaterials = useMemo(() => {
        const advection = new ShaderMaterial({
            uniforms: {
                uVelocity: {
                    value: new Texture(),
                },
                uSource: {
                    value: new Texture(),
                },
                dt: {
                    value: 0.016,
                },
                uDissipation: {
                    value: 1.0,
                },
                texelSize: { value: new Vector2() },
            },
            fragmentShader: advectionFrag,
            vertexShader: baseVertex,
            depthTest: false,
            depthWrite: false,
        });

        const clear = new ShaderMaterial({
            uniforms: {
                uTexture: {
                    value: new Texture(),
                },
                uClearValue: {
                    value: OPTS.pressure,
                },
                texelSize: {
                    value: new Vector2(),
                },
            },
            fragmentShader: clearFrag,
            vertexShader: baseVertex,
            depthTest: false,
            depthWrite: false,
        });

        const curl = new ShaderMaterial({
            uniforms: {
                uVelocity: {
                    value: new Texture(),
                },
                texelSize: {
                    value: new Vector2(),
                },
            },
            fragmentShader: curlFrag,
            vertexShader: baseVertex,
            depthTest: false,
            depthWrite: false,
        });

        const divergence = new ShaderMaterial({
            uniforms: {
                uVelocity: {
                    value: new Texture(),
                },
                texelSize: {
                    value: new Vector2(),
                },
            },
            fragmentShader: divergenceFrag,
            vertexShader: baseVertex,
            depthTest: false,
            depthWrite: false,
        });

        const gradientSubstract = new ShaderMaterial({
            uniforms: {
                uPressure: {
                    value: new Texture(),
                },
                uVelocity: {
                    value: new Texture(),
                },
                texelSize: {
                    value: new Vector2(),
                },
            },
            fragmentShader: gradientSubstractFrag,
            vertexShader: baseVertex,
            depthTest: false,
            depthWrite: false,
        });

        const pressure = new ShaderMaterial({
            uniforms: {
                uPressure: {
                    value: new Texture(),
                },
                uDivergence: {
                    value: new Texture(),
                },
                texelSize: {
                    value: new Vector2(),
                },
            },
            fragmentShader: pressureFrag,
            vertexShader: baseVertex,
            depthTest: false,
            depthWrite: false,
        });

        const splat = new ShaderMaterial({
            uniforms: {
                uTarget: {
                    value: new Texture(),
                },
                aspectRatio: {
                    value: size.width / size.height,
                },
                uColor: {
                    value: new Vector3(),
                },
                uPointer: {
                    value: new Vector2(),
                },
                uRadius: {
                    value: OPTS.radius / 100.0,
                },
                texelSize: {
                    value: new Vector2(),
                },
            },
            fragmentShader: splatFrag,
            vertexShader: baseVertex,
            depthTest: false,
            depthWrite: false,
        });

        const vorticity = new ShaderMaterial({
            uniforms: {
                uVelocity: {
                    value: new Texture(),
                },
                uCurl: {
                    value: new Texture(),
                },
                uCurlValue: {
                    value: OPTS.curl,
                },
                dt: {
                    value: 0.016,
                },
                texelSize: {
                    value: new Vector2(),
                },
            },
            fragmentShader: vorticityFrag,
            vertexShader: baseVertex,
            depthTest: false,
            depthWrite: false,
        });

        return {
            splat,
            curl,
            clear,
            divergence,
            pressure,
            gradientSubstract,
            advection,
            vorticity,
        };
    }, [size]);

    useEffect(() => {
        for (const material of Object.values(shaderMaterials)) {
            const aspectRatio = size.width / (size.height + 400);
            material.uniforms.texelSize.value.set(1 / (OPTS.simRes * aspectRatio), 1 / OPTS.simRes);
        }

        return () => {
            for (const material of Object.values(shaderMaterials)) {
                material.dispose();
            }
        };
    }, [shaderMaterials, size]);

    return shaderMaterials;
};
