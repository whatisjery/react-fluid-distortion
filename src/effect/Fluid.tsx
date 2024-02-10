import { Texture, Uniform, Vector3 } from 'three';
import { forwardRef, useEffect, useMemo } from 'react';

import { Effect } from 'postprocessing';
import { hexToRgb } from '@/utils/colors';
import { TypeEffectProps } from '@/utils/types';

import fragmentShader from '@/glsl/post.glsl';

type TypeUniformValues = {
    tFluid: Texture | null;
    uColor: Vector3;
    uBackgroundColor: Vector3;

    uRainbow: boolean;
    uShowBackground: boolean;

    uDistort: number;
    uBlend: number;
    uIntensity: number;
};

export default class FluidEffect extends Effect {
    state: Partial<TypeEffectProps>;

    constructor(props: TypeEffectProps = {}) {
        const uniforms: Record<keyof TypeUniformValues, Uniform> = {
            tFluid: new Uniform(props.tFluid ?? null),
            uDistort: new Uniform(props.distortion ?? 0),
            uRainbow: new Uniform(props.rainbow ?? false),
            uIntensity: new Uniform(props.intensity ?? 0),
            uBlend: new Uniform(props.blend ?? 0),
            uShowBackground: new Uniform(props.showBackground ?? false),

            uColor: new Uniform(hexToRgb(props.fluidColor ?? '')),
            uBackgroundColor: new Uniform(hexToRgb(props.backgroundColor ?? '')),
        };

        super('FluidEffect', fragmentShader, { uniforms: new Map(Object.entries(uniforms)) });

        this.state = {
            ...props,
        };
    }

    private updateUniform<K extends keyof TypeUniformValues>(key: K, value: TypeUniformValues[K]) {
        const uniform = this.uniforms.get(key);
        if (uniform) {
            uniform.value = value;
        }
    }

    update() {
        this.updateUniform('uIntensity', this.state.intensity!);
        this.updateUniform('uDistort', this.state.distortion!);
        this.updateUniform('uRainbow', this.state.rainbow!);
        this.updateUniform('uBlend', this.state.blend!);
        this.updateUniform('uShowBackground', this.state.showBackground!);

        this.updateUniform('uColor', hexToRgb(this.state.fluidColor!));
        this.updateUniform('uBackgroundColor', hexToRgb(this.state.backgroundColor!));
    }
}

export const Fluid = forwardRef(function Fluid(props: TypeEffectProps, ref) {
    const effect = useMemo(() => new FluidEffect(props), [props]);

    useEffect(() => {
        return () => {
            if (effect) effect.dispose();
        };
    }, [effect]);

    return <primitive ref={ref} object={effect} />;
});
