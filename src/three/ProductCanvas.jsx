// Interactive product viewer for /products — loaded on demand via Model3D.
import { Suspense, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei'
import { Lights, Env, Shadows, Model } from './scene'

// Honour "reduce motion": no auto-rotation
const REDUCE_MOTION = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Syncs the camera distance to the zoom slider value, preserving current orbit angle */
function ZoomController({ zoom }) {
  const { camera } = useThree()
  useEffect(() => {
    const len = camera.position.length()
    if (len > 0) camera.position.multiplyScalar(zoom / len)
  }, [zoom, camera])
  return null
}

export default function ProductCanvas({ model, zoom = 4 }) {
  return (
    <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <PerspectiveCamera makeDefault position={[0, 0, zoom]} fov={38} />
      <Lights />
      <Suspense fallback={null}>
        <Model name={model} />
        <Env />
      </Suspense>
      <Shadows />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={!REDUCE_MOTION} autoRotateSpeed={1.2} makeDefault />
      <ZoomController zoom={zoom} />
    </Canvas>
  )
}
