/**
 * Real 3D models — loaded from GLB files converted from the user's STEP files.
 * Each component auto-centres and normalises to a 2-unit bounding box so
 * every product looks the same size in the viewer, regardless of CAD units.
 */
import { useGLTF }      from '@react-three/drei'
import { useMemo }      from 'react'
import * as THREE       from 'three'

/* Shared brushed-aluminium PBR material — matte industrial look */
const ALU_MAT = new THREE.MeshStandardMaterial({
  color          : new THREE.Color('#7A8FA8'),
  metalness      : 0.72,
  roughness      : 0.52,
  envMapIntensity: 0.85,
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

/* ── Assembly models ────────────────────────────────────────────── */
// Long Rail STEP files: Z-up → fix with -90° X
const LONG_ROT = [-Math.PI / 2, 0, 0]
// Mono/Mini Rail STEP files: different CAD axis → need additional 90° Y
const MONO_ROT = [-Math.PI / 2, Math.PI / 2, 0]

function AsmModel({ path, size = 2.2, rot = LONG_ROT, ...props }) {
  const model = useNormalisedModel(path, size)
  return <group rotation={rot}><primitive object={model} {...props} /></group>
}

// Long Rail assemblies
export const LongRailLiteEndClamp  = p => <AsmModel path="/models/long-rail-lite-end-clamp.glb"  {...p} />
export const LongRailLiteMidClamp  = p => <AsmModel path="/models/long-rail-lite-mid-clamp.glb"  {...p} />
export const LongRailProEndClamp   = p => <AsmModel path="/models/long-rail-pro-end-clamp.glb"   {...p} />
export const LongRailProMidClamp   = p => <AsmModel path="/models/long-rail-pro-mid-clamp.glb"   {...p} />
export const LongRailUltraEndClamp = p => <AsmModel path="/models/long-rail-ultra-end-clamp.glb" {...p} />
export const LongRailUltraMidClamp = p => <AsmModel path="/models/long-rail-ultra-mid-clamp.glb" {...p} />

// Mono Rail assemblies (different CAD orientation)
export const MonoRail100EndClamp    = p => <AsmModel path="/models/mono-rail-100-end-clamp.glb"     size={1.8} rot={MONO_ROT} {...p} />
export const MonoRail100ProEndClamp = p => <AsmModel path="/models/mono-rail-100-pro-end-clamp.glb" size={1.8} rot={MONO_ROT} {...p} />
export const MonoRail70EndClamp     = p => <AsmModel path="/models/mono-rail-70-end-clamp.glb"      size={1.8} rot={MONO_ROT} {...p} />
export const MonoRail70MidClamp     = p => <AsmModel path="/models/mono-rail-70-mid-clamp-2.glb"    size={1.8} rot={MONO_ROT} {...p} />
export const MonoRail65EndClamp     = p => <AsmModel path="/models/mono-rail-65-end-clamp.glb"      size={1.8} rot={MONO_ROT} {...p} />

// Mini Rail assemblies (same CAD orientation as Mono Rail)
export const MiniRail100EndClamp   = p => <AsmModel path="/models/mini-rail-100-end-clamp.glb"   size={1.8} rot={MONO_ROT} {...p} />
export const MiniRail70EndClamp    = p => <AsmModel path="/models/mini-rail-70-end-clamp.glb"    size={1.8} rot={MONO_ROT} {...p} />
export const MiniRailShortEndClamp = p => <AsmModel path="/models/mini-rail-short-end-clamp.glb" size={1.8} rot={MONO_ROT} {...p} />

/* Pre-warm cache */
useGLTF.preload('/models/inclined-system.glb')
;[
  'long-rail-lite-end-clamp','long-rail-lite-mid-clamp',
  'long-rail-pro-end-clamp','long-rail-pro-mid-clamp',
  'long-rail-ultra-end-clamp','long-rail-ultra-mid-clamp',
  'mono-rail-100-end-clamp','mono-rail-100-pro-end-clamp',
  'mono-rail-70-end-clamp','mono-rail-70-mid-clamp-2','mono-rail-65-end-clamp',
  'mini-rail-100-end-clamp','mini-rail-70-end-clamp','mini-rail-short-end-clamp',
].forEach(name => useGLTF.preload(`/models/${name}.glb`))
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
