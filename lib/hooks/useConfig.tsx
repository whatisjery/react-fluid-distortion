import { useControls, button } from 'leva';
import { OPTS } from '../constant';

export const useConfig = () => {
    const [params, set] = useControls('Settings', () => ({
        intensity: {
            value: OPTS.intensity,
            min: 0.0,
            max: 10,
            step: 0.01,
            label: 'intensity',
        },

        force: {
            value: OPTS.force,
            min: 0,
            max: 20,
            step: 0.1,
            label: 'force',
        },

        distortion: {
            value: OPTS.distortion,
            min: 0,
            max: 2,
            step: 0.01,
            label: 'distortion',
        },

        curl: {
            value: OPTS.curl,
            min: 0,
            max: 50,
            step: 0.1,
            label: 'curl',
        },

        swirl: {
            value: OPTS.swirl,
            min: 0,
            max: 20,
            step: 1,
            label: 'swirl',
        },

        fluidColor: {
            value: OPTS.fluidColor,
            label: 'fluid color',
        },

        backgroundColor: {
            value: OPTS.backgroundColor,
            label: 'background color',
        },

        blend: {
            value: OPTS.blend,
            min: 0.0,
            max: 10,
            step: 0.01,
            label: 'blend',
        },

        showBackground: {
            value: OPTS.showBackground,
            label: 'show background',
        },

        rainbow: {
            value: OPTS.rainbow,
            label: 'rainbow mode',
        },

        pressure: {
            value: OPTS.pressure,
            min: 0,
            max: 1,
            step: 0.01,
            label: 'pressure reduction',
        },

        densityDissipation: {
            value: OPTS.densityDissipation,
            min: 0,
            max: 1,
            step: 0.01,
            label: 'density dissipation',
        },

        velocityDissipation: {
            value: OPTS.velocityDissipation,
            min: 0,
            max: 1,
            step: 0.01,
            label: 'velocity dissipation',
        },

        radius: {
            value: OPTS.radius,
            min: 0.01,
            max: 1,
            step: 0.01,
            label: 'radius',
        },
        'reset OPTS': button(() => {
            set({ ...OPTS });
        }),
    }));

    return params;
};
