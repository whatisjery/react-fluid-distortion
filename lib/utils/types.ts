import { Texture } from 'three';

export type TypeCommonProps = {
    blend?: number;
    intensity?: number;
    distortion?: number;
    rainbow?: boolean;
    fluidColor?: string;
    backgroundColor?: string;
    showBackground?: boolean;
};

export type TypeProps = TypeCommonProps & {
    densityDissipation?: number;
    pressure?: number;
    velocityDissipation?: number;
    force?: number;
    radius?: number;
    curl?: number;
    swirl?: number;
};

export type TypeEffectProps = TypeCommonProps & {
    tFluid?: Texture;
};
