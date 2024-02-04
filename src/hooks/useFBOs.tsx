import * as THREE from "three"

import { useDoubleFBO } from "@/hooks/useDoubleFBO"
import { useFBO } from "@react-three/drei"
import { useEffect, useMemo } from "react"

import settings from "@/utils/settings"

export const useFBOs = () => {
    const density = useDoubleFBO(settings.dyeRes, settings.dyeRes, {
        type: THREE.HalfFloatType,
        format: THREE.RGBAFormat,
        minFilter: THREE.LinearFilter,
        depth: false,
    })

    const velocity = useDoubleFBO(settings.simRes, settings.simRes, {
        type: THREE.HalfFloatType,
        format: THREE.RGFormat,
        minFilter: THREE.LinearFilter,
        depth: false,
    })

    const pressure = useDoubleFBO(settings.simRes, settings.simRes, {
        type: THREE.HalfFloatType,
        format: THREE.RedFormat,
        minFilter: THREE.NearestFilter,
        depth: false,
    })

    const divergence = useFBO(settings.simRes, settings.simRes, {
        type: THREE.HalfFloatType,
        format: THREE.RedFormat,
        minFilter: THREE.NearestFilter,
        depth: false,
    })

    const curl = useFBO(settings.simRes, settings.simRes, {
        type: THREE.HalfFloatType,
        format: THREE.RedFormat,
        minFilter: THREE.NearestFilter,
        depth: false,
    })

    const FBOs = useMemo(() => {
        return {
            density,
            velocity,
            pressure,
            divergence,
            curl,
        }
    }, [curl, density, divergence, pressure, velocity])

    useEffect(() => {
        return () => {
            for (const FBO of Object.values(FBOs)) {
                FBO.dispose()
            }
        }
    }, [FBOs])

    return FBOs
}
