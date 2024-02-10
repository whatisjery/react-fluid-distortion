import { useCallback, useMemo, useRef } from 'react';
import { ThreeEvent, createPortal, useFrame, useThree } from '@react-three/fiber';
import { Camera, Mesh, Scene, Vector2, Vector3, Texture, Color } from 'three';
import { useFBOs } from '@/hooks/useFBOs';
import { useMaterials } from '@/hooks/useMaterials';
import { ShaderPass } from 'three/examples/jsm/Addons.js';
import { TypeProps } from './utils/types';
import { opts } from '@/utils/options';
import { Fluid as FluidEffect } from './effect/Fluid';

interface TypeUniforms {
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
}

type TypeSplatStack = {
    mouseX?: number;
    mouseY?: number;
    velocityX?: number;
    velocityY?: number;
};

type TypeMaterialName = keyof ReturnType<typeof useMaterials>;

type TypeFBOName = keyof ReturnType<typeof useFBOs>;

export const Fluid = ({
    blend = opts.blend,
    force = opts.force,
    radius = opts.radius,
    curl = opts.curl,
    swirl = opts.swirl,
    intensity = opts.intensity,
    distortion = opts.distortion,
    fluidColor = opts.fluidColor,
    backgroundColor = opts.backgroundColor,
    showBackground = opts.showBackground,
    rainbow = opts.rainbow,
    pressure = opts.pressure,
    densityDissipation = opts.densityDissipation,
    velocityDissipation = opts.velocityDissipation,
}: TypeProps) => {
    const size = useThree((three) => three.size);
    const gl = useThree((three) => three.gl);

    const bufferScene = useMemo(() => new Scene(), []);
    const bufferCamera = useMemo(() => new Camera(), []);

    const meshRef = useRef<Mesh>(null);
    const postRef = useRef<ShaderPass>(null);
    const splatStack: TypeSplatStack[] = useRef([]).current;

    const lastMouse = useRef<Vector2>(new Vector2());
    const hasMoved = useRef<boolean>(false);

    const FBOs = useFBOs();
    const materials = useMaterials();

    const onPointerMove = useCallback(
        (event: ThreeEvent<PointerEvent>) => {
            const deltaX = event.x - lastMouse.current.x;
            const deltaY = event.y - lastMouse.current.y;

            if (!hasMoved.current) {
                hasMoved.current = true;
                lastMouse.current.set(event.x, event.y);
            }

            lastMouse.current.set(event.x, event.y);

            if (!hasMoved.current) return;

            splatStack.push({
                mouseX: event.x / size.width,
                mouseY: 1.0 - event.y / size.height,
                velocityX: deltaX * force,
                velocityY: -deltaY * force,
            });
        },
        [force, size.height, size.width, splatStack],
    );

    const setShaderMaterial = useCallback(
        (name: TypeMaterialName) => {
            if (!meshRef.current) return;

            meshRef.current.material = materials[name];
            meshRef.current.material.needsUpdate = true;
        },
        [materials],
    );

    const setRenderTarget = useCallback(
        (name: TypeFBOName) => {
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
        <K extends keyof TypeUniforms>(
            material: TypeMaterialName,
            uniform: K,
            value: TypeUniforms[K],
        ) => {
            const mat = materials[material];
            if (mat && mat.uniforms[uniform]) {
                mat.uniforms[uniform].value = value;
            }
        },
        [materials],
    );

    useFrame(({ gl }) => {
        if (!meshRef.current || !postRef.current) return;

        for (let i = splatStack.length - 1; i >= 0; i--) {
            const { mouseX, mouseY, velocityX, velocityY } = splatStack[i];

            setShaderMaterial('splat');
            setUniforms('splat', 'uTarget', FBOs.velocity.read.texture);
            setUniforms('splat', 'uPointer', new Vector2(mouseX, mouseY));
            setUniforms('splat', 'uColor', new Vector3(velocityX, velocityY, 10.0));
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
        setUniforms('clear', 'uClearValue', pressure);
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
        setUniforms('advection', 'uDissipation', velocityDissipation);

        setRenderTarget('velocity');
        setUniforms('advection', 'uVelocity', FBOs.velocity.read.texture);
        setUniforms('advection', 'uSource', FBOs.density.read.texture);
        setUniforms('advection', 'uDissipation', densityDissipation);

        setRenderTarget('density');

        gl.setRenderTarget(null);
        gl.clear();
    });

    return (
        <>
            {createPortal(
                <mesh
                    ref={meshRef}
                    onPointerMove={onPointerMove}
                    scale={[size.width, size.height, 1]}>
                    <planeGeometry args={[2, 2, 10, 10]} />
                </mesh>,
                bufferScene,
            )}

            <FluidEffect
                intensity={intensity * 0.0001}
                rainbow={rainbow}
                distortion={distortion * 0.001}
                backgroundColor={backgroundColor}
                blend={blend * 0.01}
                fluidColor={fluidColor}
                showBackground={showBackground}
                ref={postRef}
                tFluid={FBOs.density.read.texture}
            />
        </>
    );
};
