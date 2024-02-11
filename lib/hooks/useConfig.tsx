import { useControls, button } from 'leva';
import { opts } from '../utils/options';

export const useConfig = () => {
    const [params, set] = useControls('Settings', () => ({
        intensity: {
            value: opts.intensity,
            min: 0.0,
            max: 10,
            step: 0.01,
            label: 'intensity',
        },

        force: {
            value: opts.force,
            min: 0,
            max: 20,
            step: 0.1,
            label: 'force',
        },

        distortion: {
            value: opts.distortion,
            min: 0,
            max: 2,
            step: 0.01,
            label: 'distortion',
        },

        curl: {
            value: opts.curl,
            min: 0,
            max: 50,
            step: 0.1,
            label: 'curl',
        },

        swirl: {
            value: opts.swirl,
            min: 0,
            max: 20,
            step: 1,
            label: 'swirl',
        },

        fluidColor: {
            value: opts.fluidColor,
            label: 'fluid color',
        },

        backgroundColor: {
            value: opts.backgroundColor,
            label: 'background color',
        },

        blend: {
            value: opts.blend,
            min: 0.0,
            max: 10,
            step: 0.01,
            label: 'blend',
        },

        showBackground: {
            value: opts.showBackground,
            label: 'show background',
        },

        rainbow: {
            value: opts.rainbow,
            label: 'rainbow mode',
        },

        pressure: {
            value: opts.pressure,
            min: 0,
            max: 1,
            step: 0.01,
            label: 'pressure reduction',
        },

        densityDissipation: {
            value: opts.densityDissipation,
            min: 0,
            max: 1,
            step: 0.01,
            label: 'density dissipation',
        },

        velocityDissipation: {
            value: opts.velocityDissipation,
            min: 0,
            max: 1,
            step: 0.01,
            label: 'velocity dissipation',
        },

        radius: {
            value: opts.radius,
            min: 0.01,
            max: 1,
            step: 0.01,
            label: 'radius',
        },
        'reset opts': button(() => {
            set({ ...opts });
        }),
    }));

    return params;
};
