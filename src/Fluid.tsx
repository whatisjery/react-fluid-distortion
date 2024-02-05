import { useCallback, useMemo, useRef } from 'react';
import { ThreeEvent, createPortal, useFrame, useThree } from '@react-three/fiber';
import { useFBOs } from '@/hooks/useFBOs';
import { useMaterials } from '@/hooks/useMaterials';
import { ShaderPass } from 'three/examples/jsm/Addons.js';
import { Camera, Mesh, Scene, Vector2, Vector3, Texture, Color } from 'three';
import { Fluid as FluidEffect } from './effect/Fluid';

import settings from '@/utils/settings';

type Uniform =
    | 'uTarget'
    | 'uPoint'
    | 'uColor'
    | 'uRadius'
    | 'uVelocity'
    | 'uCurl'
    | 'uCurlValue'
    | 'uTexture'
    | 'uClearValue'
    | 'uPressure'
    | 'uDivergence'
    | 'uSource'
    | 'uDissipation';

type UniformValue = Texture | Vector3 | Vector2 | Color | number;

type MouseEvent = ThreeEvent<PointerEvent>;

type MaterialName = keyof ReturnType<typeof useMaterials>;

type FBOName = keyof ReturnType<typeof useFBOs>;

type Props = {
    density?: number;
    blend?: number;
    presence?: number;
    distortion?: number;
    rainbow?: boolean;
    color?: string;
    backgroundColor?: string;
    backgroundAlpha?: number;
    pressure?: number;
    velocity?: number;
    force?: number;
    radius?: number;
    curl?: number;
};

export const Fluid = ({
    density = settings.density,
    color = settings.color,
    presence = settings.presence,
    distortion = settings.distortion,
    backgroundColor = settings.backgroundColor,
    backgroundAlpha = settings.backgroundAlpha,
    blend = settings.blend,
    rainbow = settings.rainbow,
    pressure = settings.pressure,
    velocity = settings.velocity,
    force = settings.force,
    radius = settings.radius,
    curl = settings.curl,
}: Props) => {
    const size = useThree((three) => three.size);
    const gl = useThree((three) => three.gl);

    const bufferScene = useMemo(() => new Scene(), []);
    const bufferCamera = useMemo(() => new Camera(), []);

    const meshRef = useRef<Mesh>(null);
    const postRef = useRef<ShaderPass>(null);
    const lastMouse = useRef<Vector2>(new Vector2());
    const mouseMoved = useRef<boolean>(false);
    const splats: any = useRef([]).current;

    const FBOs = useFBOs();
    const materials = useMaterials();

    const onPointerMove = useCallback(
        (event: MouseEvent) => {
            const deltaX = event.x - lastMouse.current.x;
            const deltaY = event.y - lastMouse.current.y;

            if (!mouseMoved.current) {
                mouseMoved.current = true;
                lastMouse.current.set(event.x, event.y);
            }

            lastMouse.current.set(event.x, event.y);

            if (Math.abs(deltaX) || Math.abs(deltaY)) {
                splats.push({
                    mouseX: event.x / size.width,
                    mouseY: 1.0 - event.y / size.height,
                    velocityX: deltaX * force,
                    velocityY: -deltaY * force,
                });
            }
        },
        [force, size.height, size.width, splats],
    );

    const setShaderMaterial = useCallback(
        (name: MaterialName) => {
            if (!meshRef.current) return;

            meshRef.current.material = materials[name];
            meshRef.current.material.needsUpdate = true;
        },
        [materials],
    );

    const setRenderTarget = useCallback(
        (name: FBOName) => {
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
        (material: MaterialName, uniform: Uniform, value: UniformValue) => {
            materials[material].uniforms[uniform].value = value;
        },
        [materials],
    );

    useFrame(({ gl }) => {
        if (!meshRef.current || !postRef.current) return;

        // Render splat
        for (let i = splats.length - 1; i >= 0; i--) {
            const { mouseX, mouseY, velocityX, velocityY } = splats[i];

            setShaderMaterial('splat');
            setUniforms('splat', 'uTarget', FBOs.velocity.read.texture);
            setUniforms('splat', 'uPoint', new Vector2(mouseX, mouseY));
            setUniforms('splat', 'uColor', new Vector3(velocityX, velocityY, 10.0));
            setUniforms('splat', 'uRadius', radius / 100.0);
            setRenderTarget('velocity');
            setUniforms('splat', 'uTarget', FBOs.density.read.texture);
            setRenderTarget('density');

            splats.splice(i, 1);
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

        setUniforms('pressure', 'uPressure', FBOs.pressure.read.texture);
        setRenderTarget('pressure');

        setShaderMaterial('gradientSubstract');
        setUniforms('gradientSubstract', 'uPressure', FBOs.pressure.read.texture);
        setUniforms('gradientSubstract', 'uVelocity', FBOs.velocity.read.texture);
        setRenderTarget('velocity');

        setShaderMaterial('advection');
        setUniforms('advection', 'uVelocity', FBOs.velocity.read.texture);
        setUniforms('advection', 'uSource', FBOs.velocity.read.texture);
        setUniforms('advection', 'uDissipation', velocity);

        setRenderTarget('velocity');
        setUniforms('advection', 'uVelocity', FBOs.velocity.read.texture);
        setUniforms('advection', 'uSource', FBOs.density.read.texture);
        setUniforms('advection', 'uDissipation', density);

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
                    scale={[size.width, size.height, 1]}
                >
                    <planeGeometry args={[2, 2, 10, 10]} />
                </mesh>,
                bufferScene,
            )}

            <FluidEffect
                presence={presence * 0.0001}
                rainbow={rainbow}
                distortion={distortion * 0.001}
                backgroundColor={backgroundColor}
                blend={blend * 0.01}
                color={color}
                ref={postRef}
                tFluid={FBOs.density.read.texture}
                backgroundAlpha={backgroundAlpha}
            />
        </>
    );
};
