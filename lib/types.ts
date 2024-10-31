import { BlendFunction } from 'postprocessing';
import { Texture } from 'three';

export type SharedProps = {
    blend?: number;
    intensity?: number;
    distortion?: number;
    rainbow?: boolean;
    fluidColor?: string;
    backgroundColor?: string;
    showBackground?: boolean;
    blendFunction?: BlendFunction;
};

export type Props = SharedProps & {
    densityDissipation?: number;
    pressure?: number;
    velocityDissipation?: number;
    force?: number;
    radius?: number;
    curl?: number;
    swirl?: number;
};

export type EffectProps = SharedProps & {
    tFluid?: Texture;
};
