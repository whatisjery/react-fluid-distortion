import { useThree } from '@react-three/fiber';
import { useCallback, useEffect, useRef } from 'react';

import { Vector2 } from 'three';

type SplatStack = {
    mouseX: number;
    mouseY: number;
    velocityX: number;
    velocityY: number;
};

export const usePointer = ({ force }: { force: number }) => {
    const size = useThree((three) => three.size);

    const splatStack: SplatStack[] = useRef([]).current;

    const lastMouse = useRef<Vector2>(new Vector2());
    const hasMoved = useRef<boolean>(false);

    const onPointerMove = useCallback(
        (event: { x: number; y: number }) => {
            const deltaX = event.x - lastMouse.current.x;
            const deltaY = event.y - lastMouse.current.y;

            if (!hasMoved.current) {
                hasMoved.current = true;
                lastMouse.current.set(event.x, event.y);
                return;
            }

            lastMouse.current.set(event.x, event.y);

            const splatInfo = {
                mouseX: event.x / size.width,
                mouseY: 1.0 - event.y / size.height,
                velocityX: deltaX * force,
                velocityY: -deltaY * force,
            };
            // console.log(splatInfo.mouseX, splatInfo.mouseY)
            splatStack.push(splatInfo);
        },
        [force, size.height, size.width, splatStack],
    );

    useEffect(() => {
        addEventListener('pointermove', onPointerMove);
        return () => {
            removeEventListener('pointermove', onPointerMove);
        };
    }, [onPointerMove]);

    return splatStack;
};
