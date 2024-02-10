# Fluid Distortion for React Three Fiber

![screen capture](./src/assets/screen_capture.png)

Post-processing for fluid distortion effect, based on the shaders developed by [Pavel Dobryakov](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation) adapted to work with [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction).

## Installation :

## Usage :

```jsx
import { EffectComposer } from '@react-three/postprocessing';
import { Fluid } from '@/index';

<EffectComposer>
    <Fluid />
</EffectComposer>;
```

## Debug pannel :

You can show a debug pannel (powered by [Leva](https://github.com/pmndrs/leva)) to test the options more easily.

```jsx
import { EffectComposer } from '@react-three/postprocessing';
import { Fluid, useConfig } from '@/index';

const config = useConfig();

<EffectComposer>
    <Fluid {...config} />
</EffectComposer>;
```

## Options :

| Name                   | Type    | Default Value | Description                                                               |
| ---------------------- | ------- | ------------- | ------------------------------------------------------------------------- |
| `fluidColor`           | string  | `#005eff`     | Sets the fluid color ONLY IF `rainbow` is false.                          |
| `backgroundColor`      | string  | `#070410`     | Sets background color ONLY IF `showBackground` is true.                   |
| `showBackground`       | boolean | `false`       | Toggles the background color's visibility.                                |
| `blend`                | number  | `5`           | [0.00 to 10.0] Blends fluid into the scene when `showBackground` is true. |
| `intensity`            | number  | `10`          | [0 to 10] Sets the fluid intensity.                                       |
| `force`                | number  | `2`           | [0.0 to 20] Multiply the mouse velocity to increase fluid splatter.       |
| `distortion`           | number  | `2`           | [0.00 to 2.00] Sets Distortion amount.                                    |
| `radius`               | number  | `0.3`         | [0.01 to 1.00] Sets the fluid radius.                                     |
| `curl`                 | number  | `10`          | [0.0 to 50] Sets the amount of the curl effect                            |
| `swirl`                | number  | `20`          | [0 to 20] Sets the amount of the swirling effect.                         |
| `velocityDissipation`  | number  | `0.99`        | [0.00 to 1.00] Reduces the fluid velocity over time.                      |
| `densitionDissipation` | number  | `0.95`        | [0.00 to 1.00] Reduces the fluid density over time.                       |
| `pressure`             | number  | `0.80`        | [0.00 to 1.00] Controls the reduction of pressure.                        |
| `rainbow`              | boolean | `true`        | Activates color mode based on mouse direction.                            |
