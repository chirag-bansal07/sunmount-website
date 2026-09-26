// Shared studio lighting for every 3D viewer. Lives in the lazy 3D chunk only.
import { Environment, ContactShadows } from '@react-three/drei'
import * as Models from './RailModels'

// Self-hosted, 256×128 downsample of drei's "sunset" preset (131 KB vs 1.4 MB
// fetched from GitHub at runtime) — plenty for reflections on matte aluminium.
const ENV_FILE = '/hdri/venice_sunset_256.hdr'

export function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 4, 2]} intensity={2.0} color="#FBB034" />
      <directionalLight position={[-3, 1, -2]} intensity={0.7} color="#6090d4" />
      <directionalLight position={[0, 3, -4]} intensity={0.5} color="#ffffff" />
    </>
  )
}

export function Env() {
  return <Environment files={ENV_FILE} />
}

export function Shadows() {
  return <ContactShadows position={[0, -0.8, 0]} opacity={0.40} scale={6} blur={2.5} far={3} />
}

/** Resolves a model name from src/data/products.js to its RailModels component. */
export function Model({ name, ...props }) {
  const Component = Models[name]
  return Component ? <Component {...props} /> : null
}
