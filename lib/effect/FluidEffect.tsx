import { Effect } from 'postprocessing';
import { Texture, Uniform, Vector3 } from 'three';
import { EffectProps } from '../types';
import { hexToRgb } from '../utils';

import fragmentShader from '../glsl/post.frag';

type Uniforms = {
    tFluid: Texture | null;
    uColor: Vector3;
    uBackgroundColor: Vector3;
    uRainbow: boolean;
    uShowBackground: boolean;
    uDistort: number;
    uBlend: number;
    uIntensity: number;
};

export class FluidEffect extends Effect {
    state: Partial<EffectProps>;

    constructor(props: EffectProps = {}) {
        const uniforms: Record<keyof Uniforms, Uniform> = {
            tFluid: new Uniform(props.tFluid),
            uDistort: new Uniform(props.distortion),
            uRainbow: new Uniform(props.rainbow),
            uIntensity: new Uniform(props.intensity),
            uBlend: new Uniform(props.blend),
            uShowBackground: new Uniform(props.showBackground),

            uColor: new Uniform(hexToRgb(props.fluidColor!)),
            uBackgroundColor: new Uniform(hexToRgb(props.backgroundColor!)),
        };

        super('FluidEffect', fragmentShader, { uniforms: new Map(Object.entries(uniforms)) });

        this.state = {
            ...props,
        };
    }

    private updateUniform<K extends keyof Uniforms>(key: K, value: Uniforms[K]) {
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
