[![Version](https://img.shields.io/npm/v/@whatisjery/react-fluid-distortion?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/@whatisjery/react-fluid-distortion)

# Fluid Distortion for React Three Fiber

![screen capture](./src/assets/screen_capture.png)

Implementing post-processing fluid distortion effects in response to cursor interactions for React-Three-Fiber.
Based on the shaders developed by [Pavel Dobryakov](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation)

## Try it :

[codesandbox](https://codesandbox.io/p/github/whatisjery/react-fluid-distortion)

## Installation :

```bash
npm install @whatisjery/react-fluid-distortion @react-three/drei postprocessing leva
```

```bash
yarn add @whatisjery/react-fluid-distortion @react-three/drei postprocessing leva
```

```bash
pnpm add @whatisjery/react-fluid-distortion @react-three/drei postprocessing leva
```

-   The required dependencies for it to work are [postprocessing](https://github.com/pmndrs/postprocessing) and [drei](https://github.com/pmndrs/drei). <br>
-   If you want to use the debug panel you also need to install [leva](https://github.com/pmndrs/leva).

## Example of use :

```jsx
import { Fluid } from '@/whatisjery/react-fluid-distortion';
import { EffectComposer } from '@react-three/postprocessing';
import { Canvas } from '@react-three/fiber';

<Canvas
    style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
        background: '#000000',
    }}>
    <EffectComposer>
        <Fluid />
        {... other effets}
    </EffectComposer>
</Canvas>;
```

## Example of use with debug panel :

Show a debug panel to test options more easily.

```jsx
import { Fluid, useConfig } from '@/whatisjery/react-fluid-distortion';
import { EffectComposer } from '@react-three/postprocessing';
import { Canvas } from '@react-three/fiber';

const config = useConfig();

<Canvas
    style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
        background: '#000000',
    }}>
    <EffectComposer>
        <Fluid {...config} />
        {... other effets}
    </EffectComposer>
</Canvas>;
```

## Options :

| Name                   | Type    | Default Value | Description                                                                                    |
| ---------------------- | ------- | ------------- | ---------------------------------------------------------------------------------------------- |
| `fluidColor`           | string  | `#005eff`     | Sets the fluid color. Effective only when `rainbow` is set to `false`.                         |
| `backgroundColor`      | string  | `#070410`     | Sets the background color. Effective only when `showBackground` is `true`.                     |
| `showBackground`       | boolean | `false`       | Toggles the background color's visibility. If `false` it becomes transprent.                   |
| `blend`                | number  | `5`           | Blends fluid into the scene when `showBackground` is true. Valid range: `0.00` to `10.0`.      |
| `intensity`            | number  | `10`          | Sets the fluid intensity. Valid range: `0` to `10`.                                            |
| `force`                | number  | `2`           | Multiplies the mouse velocity to increase fluid splatter. Valid range: `0.0` to `20`.          |
| `distortion`           | number  | `2`           | Sets the distortion amount. Valid range: `0.00` to `2.00`.                                     |
| `radius`               | number  | `0.3`         | Sets the fluid radius. Valid range: `0.01` to `1.00`.                                          |
| `curl`                 | number  | `10`          | Sets the amount of the curl effect. Valid range: `0.0` to `50`.                                |
| `swirl`                | number  | `20`          | Sets the amount of the swirling effect. Valid range: `0` to `20`.                              |
| `velocityDissipation`  | number  | `0.99`        | Reduces the fluid velocity over time. Valid range: `0.00` to `1.00`.                           |
| `densitionDissipation` | number  | `0.95`        | Reduces the fluid density over time. Valid range: `0.00` to `1.00`.                            |
| `pressure`             | number  | `0.80`        | Controls the reduction of pressure. Valid range: `0.00` to `1.00`.                             |
| `rainbow`              | boolean | `true`        | Activates color mode based on mouse direction. No range applicable as this is a boolean value. |
