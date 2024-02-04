import { Texture, Uniform } from 'three';
import { forwardRef, useEffect, useMemo } from 'react';

import { Effect } from 'postprocessing';
import { hexToNormalizedRgb } from '@/utils/normalizeColor';
import fragmentShader from '@/glsl/post.glsl';

type Fluid = {
    blend?: number;
    presence?: number;
    distortion?: number;
    rainbow?: boolean;
    color?: string;
    backgroundColor?: string;
    backgroundAlpha?: number;
    tFluid?: Texture;
};

let state: Partial<Fluid> = {};

export default class FluidEffect extends Effect {
    constructor({
        blend,
        presence,
        distortion,
        rainbow,
        color,
        backgroundColor,
        backgroundAlpha,
        tFluid,
    }: Fluid = {}) {
        super('FluidEffect', fragmentShader, {
            uniforms: new Map<string, Uniform<any>>([
                ['tFluid', new Uniform(tFluid)],
                ['uDistort', new Uniform(distortion)],
                ['uRainbow', new Uniform(rainbow)],
                ['uPresence', new Uniform(presence)],
                ['uColor', new Uniform(hexToNormalizedRgb(color ?? ''))],
                ['uBackground', new Uniform(hexToNormalizedRgb(backgroundColor ?? ''))],
                ['uBlend', new Uniform(blend)],
                ['uRainbow', new Uniform(rainbow)],
                ['uBackgroundAlpha', new Uniform(backgroundAlpha)],
            ]),
        });

        state = {
            blend,
            presence,
            distortion,
            rainbow,
            color,
            backgroundColor,
            backgroundAlpha,
            tFluid,
        };
    }

    update() {
        this.uniforms.get('uPresence')!.value = state.presence;
        this.uniforms.get('uDistort')!.value = state.distortion;
        this.uniforms.get('uRainbow')!.value = state.rainbow;
        this.uniforms.get('uColor')!.value = hexToNormalizedRgb(state.color ?? '');
        this.uniforms.get('uBackground')!.value = hexToNormalizedRgb(state.backgroundColor ?? '');
        this.uniforms.get('uBlend')!.value = state.blend;
        this.uniforms.get('uBackgroundAlpha')!.value = state.backgroundAlpha;
    }
}

export const Fluid = forwardRef(function Fluid(props: Fluid, ref) {
    const effect = useMemo(() => new FluidEffect(props), [props]);

    useEffect(() => {
        return () => {
            if (effect) effect.dispose();
        };
    }, [effect]);

    return <primitive ref={ref} object={effect} />;
});
