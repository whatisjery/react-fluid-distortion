import { Color, Vector3 } from 'three';
import { OPTS } from './constant';

export const hexToRgb = (hex: string) => {
    const color = new Color(hex);

    return new Vector3(color.r, color.g, color.b);
};

export const normalizeScreenHz = (value: number, dt: number) => {
    return Math.pow(value, dt * OPTS.refreshRate);
};
