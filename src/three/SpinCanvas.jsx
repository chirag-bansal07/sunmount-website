// Auto-spinning card viewer for the homepage product grid — loaded on demand via Model3D.
import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { Lights, Env, Shadows, Model } from './scene'

// Honour "reduce motion": no auto-rotation
const REDUCE_MOTION = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function SpinModel({ model, modelProps, hover }) {
  const ref = useRef()
  useFrame((_, dt) => {
    if (!ref.current) return
    if (hover) {
      // Snap to nearest full turn of the target so we never spin backwards
      const y = ref.current.rotation.y
      const x = ref.current.rotation.x
      const tY = -0.65 + Math.round((y + 0.65) / (Math.PI * 2)) * Math.PI * 2
      const tX = -0.28 + Math.round((x + 0.28) / (Math.PI * 2)) * Math.PI * 2
      ref.current.rotation.y += (tY - y) * 0.10
      ref.current.rotation.x += (tX - x) * 0.10
    } else {
      if (!REDUCE_MOTION) ref.current.rotation.y += dt * 0.55
      ref.current.rotation.x += (0.18 - ref.current.rotation.x) * 0.05
    }
  })
  return (
    <group ref={ref}>
      <Model name={model} {...modelProps} />
    </group>
  )
}

export default function SpinCanvas({ model, modelProps, hover }) {
  return (
    <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}>
      <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={40} />
      <Lights />
      <Suspense fallback={null}>
        <SpinModel model={model} modelProps={modelProps} hover={hover} />
        <Env />
      </Suspense>
      <Shadows />
    </Canvas>
  )
}
