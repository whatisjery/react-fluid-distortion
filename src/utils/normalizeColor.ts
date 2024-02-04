import * as THREE from 'three'

export const hexToNormalizedRgb = (hex: string) => {
    const color = new THREE.Color(hex)

    return new THREE.Vector3(color.r, color.g, color.b)
}
