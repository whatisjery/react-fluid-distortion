import { forwardRef, useEffect, useMemo } from 'react';
import { EffectProps } from '../types';
import { FluidEffect } from './FluidEffect';

export const Effect = forwardRef(function Fluid(props: EffectProps, ref) {
    // prevent re-creating the effect on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const effect = useMemo(() => new FluidEffect(props), []);

    useEffect(() => {
        return () => {
            effect.dispose?.();
        };
    }, [effect]);

    return <primitive ref={ref} object={effect} dispose={null} />;
});
