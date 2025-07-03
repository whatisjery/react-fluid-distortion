import { createPortal, useFrame, useThree } from '@react-three/fiber';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Camera, Color, Mesh, Scene, Texture, Vector2, Vector3 } from 'three';
import { ShaderPass } from 'three/examples/jsm/Addons.js';
import { Effect as FluidEffect } from './effect/Fluid';
import { useFBOs } from './hooks/useFBOs';
import { useMaterials } from './hooks/useMaterials';
import { Props } from './types';
import { OPTS } from './constant';
import { usePointer } from './hooks/usePointer';
import { BlendFunction } from 'postprocessing';
import { normalizeScreenHz } from './utils';

type Uniforms = {
    uColor: Vector3 | Color;
    uPointer: Vector2;
    uTarget: Texture | null;
    uVelocity: Texture;
    uCurl: Texture;
    uTexture: Texture;
    uPressure: Texture;
    uDivergence: Texture;
    uSource: Texture;
    uRadius: number;
    uClearValue: number;
    uCurlValue: number;
    uDissipation: number;
};

export const Fluid = ({
    blend = OPTS.blend,
    force = OPTS.force,
    radius = OPTS.radius,
    curl = OPTS.curl,
    swirl = OPTS.swirl,
    intensity = OPTS.intensity,
    distortion = OPTS.distortion,
    fluidColor = OPTS.fluidColor,
    backgroundColor = OPTS.backgroundColor,
    showBackground = OPTS.showBackground,
    rainbow = OPTS.rainbow,
    pressure = OPTS.pressure,
    densityDissipation = OPTS.densityDissipation,
    velocityDissipation = OPTS.velocityDissipation,
    blendFunction = BlendFunction.NORMAL,
}: Props) => {
    const size = useThree((three) => three.size);
    const gl = useThree((three) => three.gl);

    const [bufferScene] = useState(() => new Scene());
    const bufferCamera = useMemo(() => new Camera(), []);

    const meshRef = useRef<Mesh>(null);
    const postRef = useRef<ShaderPass>(null);
    const pointerRef = useRef(new Vector2());
    const colorRef = useRef(new Vector3());

    const FBOs = useFBOs();
    const materials = useMaterials();
    const splatStack = usePointer({ force });

    const setShaderMaterial = useCallback(
        (name: keyof ReturnType<typeof useMaterials>) => {
            if (!meshRef.current) return;

            meshRef.current.material = materials[name];
            meshRef.current.material.needsUpdate = true;
        },
        [materials],
    );

    const setRenderTarget = useCallback(
        (name: keyof ReturnType<typeof useFBOs>) => {
            const target = FBOs[name];

            if ('write' in target) {
                gl.setRenderTarget(target.write);
                gl.clear();
                gl.render(bufferScene, bufferCamera);
                target.swap();
            } else {
                gl.setRenderTarget(target);
                gl.clear();
                gl.render(bufferScene, bufferCamera);
            }
        },
        [bufferCamera, bufferScene, FBOs, gl],
    );

    const setUniforms = useCallback(
        <K extends keyof Uniforms>(
            material: keyof ReturnType<typeof useMaterials>,
            uniform: K,
            value: Uniforms[K],
        ) => {
            const mat = materials[material];

            if (mat && mat.uniforms[uniform]) {
                mat.uniforms[uniform].value = value;
            }
        },
        [materials],
    );

    useFrame((_, delta) => {
        if (!meshRef.current || !postRef.current) return;

        for (let i = splatStack.length - 1; i >= 0; i--) {
            const { mouseX, mouseY, velocityX, velocityY } = splatStack[i];

            pointerRef.current.set(mouseX, mouseY);
            colorRef.current.set(velocityX, velocityY, 10.0);

            setShaderMaterial('splat');
            setUniforms('splat', 'uTarget', FBOs.velocity.read.texture);
            setUniforms('splat', 'uPointer', pointerRef.current);
            setUniforms('splat', 'uColor', colorRef.current);
            setUniforms('splat', 'uRadius', radius / 100.0);
            setRenderTarget('velocity');
            setUniforms('splat', 'uTarget', FBOs.density.read.texture);
            setRenderTarget('density');

            splatStack.pop();
        }

        setShaderMaterial('curl');
        setUniforms('curl', 'uVelocity', FBOs.velocity.read.texture);
        setRenderTarget('curl');

        setShaderMaterial('vorticity');
        setUniforms('vorticity', 'uVelocity', FBOs.velocity.read.texture);
        setUniforms('vorticity', 'uCurl', FBOs.curl.texture);
        setUniforms('vorticity', 'uCurlValue', curl);
        setRenderTarget('velocity');

        setShaderMaterial('divergence');
        setUniforms('divergence', 'uVelocity', FBOs.velocity.read.texture);
        setRenderTarget('divergence');

        setShaderMaterial('clear');
        setUniforms('clear', 'uTexture', FBOs.pressure.read.texture);
        setUniforms('clear', 'uClearValue', normalizeScreenHz(pressure, delta));
        setRenderTarget('pressure');

        setShaderMaterial('pressure');
        setUniforms('pressure', 'uDivergence', FBOs.divergence.texture);

        for (let i = 0; i < swirl; i++) {
            setUniforms('pressure', 'uPressure', FBOs.pressure.read.texture);
            setRenderTarget('pressure');
        }

        setShaderMaterial('gradientSubstract');
        setUniforms('gradientSubstract', 'uPressure', FBOs.pressure.read.texture);
        setUniforms('gradientSubstract', 'uVelocity', FBOs.velocity.read.texture);
        setRenderTarget('velocity');

        setShaderMaterial('advection');
        setUniforms('advection', 'uVelocity', FBOs.velocity.read.texture);
        setUniforms('advection', 'uSource', FBOs.velocity.read.texture);
        setUniforms('advection', 'uDissipation', normalizeScreenHz(velocityDissipation, delta));

        setRenderTarget('velocity');
        setUniforms('advection', 'uVelocity', FBOs.velocity.read.texture);
        setUniforms('advection', 'uSource', FBOs.density.read.texture);
        setUniforms('advection', 'uDissipation', normalizeScreenHz(densityDissipation, delta));

        setRenderTarget('density');
    });

    return (
        <>
            {createPortal(
                <mesh ref={meshRef} scale={[size.width, size.height, 1]}>
                    <planeGeometry args={[2, 2]} />
                </mesh>,
                bufferScene,
            )}

            <FluidEffect
                blendFunction={blendFunction}
                intensity={intensity}
                rainbow={rainbow}
                distortion={distortion}
                backgroundColor={backgroundColor}
                blend={blend}
                fluidColor={fluidColor}
                showBackground={showBackground}
                ref={postRef}
                tFluid={FBOs.density.read.texture}
            />
        </>
    );
};
