import { useControls, button } from 'leva';
import settings from '@/utils/settings';

export const useConfig = () => {
    const [params, set] = useControls('Settings', () => ({
        blend: {
            value: settings.blend,
            min: 0.0,
            max: 10,
            step: 0.01,
            label: 'blend',
        },

        presence: {
            value: settings.presence,
            min: 0.0,
            max: 10,
            step: 0.01,
            label: 'presence',
        },

        force: {
            value: settings.force,
            min: 0,
            max: 20,
            step: 0.1,
            label: 'force',
        },

        distortion: {
            value: settings.distortion,
            min: 0,
            max: 2,
            step: 0.01,
            label: 'distortion',
        },

        curl: {
            value: settings.curl,
            min: 0,
            max: 50,
            step: 0.1,
            label: 'curl',
        },

        color: {
            value: settings.color,
            label: 'fluid color',
        },

        backgroundColor: {
            value: settings.backgroundColor,
            label: 'background color',
        },

        backgroundAlpha: {
            value: settings.backgroundAlpha,
            min: 0,
            max: 1,
            step: 0.01,
            label: 'bg opacity',
        },

        rainbow: {
            value: settings.rainbow,
            label: 'rainbow mode',
        },

        pressure: {
            value: settings.pressure,
            min: 0,
            max: 1,
            step: 0.01,
            label: 'pressure dissipation',
        },

        density: {
            value: settings.density,
            min: 0,
            max: 1,
            step: 0.01,
            label: 'density dissipation',
        },

        velocity: {
            value: settings.velocity,
            min: 0,
            max: 1,
            step: 0.01,
            label: 'velocity dissipation',
        },

        radius: {
            value: settings.radius,
            min: 0.01,
            max: 1,
            step: 0.01,
            label: 'radius',
        },
        'reset settings': button(() => {
            set({ ...settings });
        }),
    }));

    return params;
};
