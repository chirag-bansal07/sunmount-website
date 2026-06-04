/**
 * Real 3D models — loaded from GLB files converted from the user's STEP files.
 * Each component auto-centres and normalises to a 2-unit bounding box so
 * every product looks the same size in the viewer, regardless of CAD units.
 */
import { useGLTF }      from '@react-three/drei'
import { useMemo }      from 'react'
import * as THREE       from 'three'

/* Shared brushed-aluminium PBR material */
const ALU_MAT = new THREE.MeshStandardMaterial({
  color          : new THREE.Color('#C9D4DE'),
  metalness      : 0.95,
  roughness      : 0.22,
  envMapIntensity: 1.3,
})

/**
 * Load a GLB, clone it, apply aluminium material, and normalise
 * the geometry so it fits inside a 2-unit cube centred at the origin.
 */
function useNormalisedModel (path, targetSize = 2) {
  const { scene } = useGLTF(path)

  return useMemo(() => {
    const clone = scene.clone(true)

    // Apply material to every mesh
    clone.traverse(o => {
      if (o.isMesh) {
        o.material      = ALU_MAT
        o.castShadow    = true
        o.receiveShadow = true
      }
    })

    // Compute bounding box of the whole cloned scene
    const box    = new THREE.Box3().setFromObject(clone)
    const centre = new THREE.Vector3()
    const size   = new THREE.Vector3()
    box.getCenter(centre)
    box.getSize(size)

    const maxDim = Math.max(size.x, size.y, size.z)
    const scale  = maxDim > 0 ? targetSize / maxDim : 1

    // Wrap in a normalising group: centre then scale
    const wrapper = new THREE.Group()
    clone.position.sub(centre)          // centre at origin
    wrapper.add(clone)
    wrapper.scale.setScalar(scale)      // scale to fit targetSize

    return wrapper
  }, [scene, targetSize])
}

/* ── Exported components ──────────────────────────────────────── */

export function MonoRail (props) {
  const model = useNormalisedModel('/models/mono-rail.glb')
  return <primitive object={model} {...props} />
}

export function MiniRail (props) {
  const model = useNormalisedModel('/models/mini-rail.glb')
  return <primitive object={model} {...props} />
}

export function LongRail (props) {
  const model = useNormalisedModel('/models/long-rail.glb')
  return <primitive object={model} {...props} />
}

export function SeamClamp (props) {
  const model = useNormalisedModel('/models/seam-clamp.glb')
  return <primitive object={model} {...props} />
}

export function SeamClamp100Pro (props) {
  const model = useNormalisedModel('/models/seam-clamp-100pro.glb')
  return <primitive object={model} {...props} />
}

export function SeamClamp55 (props) {
  const model = useNormalisedModel('/models/seam-clamp-55.glb')
  return <primitive object={model} {...props} />
}

export function SeamClamp70T1 (props) {
  const model = useNormalisedModel('/models/seam-clamp-70t1.glb')
  return <primitive object={model} {...props} />
}

export function SeamClamp70T2 (props) {
  const model = useNormalisedModel('/models/seam-clamp-70t2.glb')
  return <primitive object={model} {...props} />
}

/** Inclined System — reuses the mono-rail profile with a visible tilt */
export function InclinedRail (props) {
  const model = useNormalisedModel('/models/mono-rail.glb')
  return (
    <group rotation={[0.28, 0, 0]}>
      <primitive object={model} {...props} />
    </group>
  )
}

/** Inclined System — full assembly model */
export function InclinedSystem (props) {
  const model = useNormalisedModel('/models/inclined-system.glb', 2.2)
  return (
    <group rotation={[-0.12, 0.3, 0]}>
      <primitive object={model} {...props} />
    </group>
  )
}

/** Short Rail — compact version using mini-rail profile */
export function ShortRail (props) {
  const model = useNormalisedModel('/models/mini-rail.glb')
  return <primitive object={model} {...props} />
}

/* ── Variant-specific components ──────────────────────────────── */

export function MonoRail100 (props) {
  const model = useNormalisedModel('/models/mono-rail-100.glb')
  return <primitive object={model} {...props} />
}

export function MonoRail70 (props) {
  const model = useNormalisedModel('/models/mono-rail-70.glb')
  return <primitive object={model} {...props} />
}

export function MonoRail65 (props) {
  const model = useNormalisedModel('/models/mono-rail-65.glb')
  return <primitive object={model} {...props} />
}

export function MonoRail100Pro (props) {
  const model = useNormalisedModel('/models/mono-rail-100-pro.glb')
  return <primitive object={model} {...props} />
}

export function MiniRail100 (props) {
  const model = useNormalisedModel('/models/mini-rail-100.glb')
  return <primitive object={model} {...props} />
}

export function MiniRail70 (props) {
  const model = useNormalisedModel('/models/mini-rail-70.glb')
  return <primitive object={model} {...props} />
}

export function MiniRailShort (props) {
  const model = useNormalisedModel('/models/mini-rail-short.glb')
  return <primitive object={model} {...props} />
}

export function LongRailUltra (props) {
  const model = useNormalisedModel('/models/long-rail-ultra.glb')
  return <primitive object={model} {...props} />
}

export function LongRailLite (props) {
  const model = useNormalisedModel('/models/long-rail-lite.glb')
  return <primitive object={model} {...props} />
}

export function LongRailPro (props) {
  const model = useNormalisedModel('/models/long-rail-pro.glb')
  return <primitive object={model} {...props} />
}

/* ── Assembly models ──────────────────────────────────────────── */

export function LongRailLiteEndClamp (props) {
  const model = useNormalisedModel('/models/long-rail-lite-end-clamp.glb', 2.2)
  return <primitive object={model} {...props} />
}

export function LongRailLiteMidClamp (props) {
  const model = useNormalisedModel('/models/long-rail-lite-mid-clamp.glb', 2.2)
  return <primitive object={model} {...props} />
}

/* Pre-warm cache */
useGLTF.preload('/models/inclined-system.glb')
useGLTF.preload('/models/long-rail-lite-end-clamp.glb')
useGLTF.preload('/models/long-rail-lite-mid-clamp.glb')
useGLTF.preload('/models/seam-clamp-100pro.glb')
useGLTF.preload('/models/seam-clamp-55.glb')
useGLTF.preload('/models/seam-clamp-70t1.glb')
useGLTF.preload('/models/seam-clamp-70t2.glb')
useGLTF.preload('/models/mono-rail.glb')
useGLTF.preload('/models/mini-rail.glb')
useGLTF.preload('/models/long-rail.glb')
useGLTF.preload('/models/seam-clamp.glb')
useGLTF.preload('/models/mono-rail-100.glb')
useGLTF.preload('/models/mono-rail-70.glb')
useGLTF.preload('/models/mono-rail-65.glb')
useGLTF.preload('/models/mono-rail-100-pro.glb')
useGLTF.preload('/models/mini-rail-100.glb')
useGLTF.preload('/models/mini-rail-70.glb')
useGLTF.preload('/models/mini-rail-short.glb')
useGLTF.preload('/models/long-rail-ultra.glb')
useGLTF.preload('/models/long-rail-lite.glb')
useGLTF.preload('/models/long-rail-pro.glb')
