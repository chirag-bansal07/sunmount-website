import { useMemo } from 'react'
import * as THREE from 'three'

// Aluminum material — brushed metal look
export const aluminumMaterial = (color = '#C9D4E0') => (
  <meshStandardMaterial
    color={color}
    metalness={0.95}
    roughness={0.25}
    envMapIntensity={1.2}
  />
)

// ------------------ MINI RAIL ------------------
// Low-profile, compact aluminum extrusion. Shaped like a small hat profile.
export function MiniRail({ length = 4, ...props }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    // Hat profile cross-section (low-profile)
    s.moveTo(-0.25, 0)
    s.lineTo(-0.25, 0.12)
    s.lineTo(-0.10, 0.12)
    s.lineTo(-0.10, 0.22)
    s.lineTo(0.10, 0.22)
    s.lineTo(0.10, 0.12)
    s.lineTo(0.25, 0.12)
    s.lineTo(0.25, 0)
    s.lineTo(-0.25, 0)
    return s
  }, [])

  const geometry = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: length,
      bevelEnabled: true,
      bevelThickness: 0.005,
      bevelSize: 0.005,
      bevelSegments: 2,
    })
    geo.translate(0, 0, -length / 2)
    return geo
  }, [shape, length])

  return (
    <mesh geometry={geometry} castShadow receiveShadow {...props}>
      {aluminumMaterial('#C9D4E0')}
    </mesh>
  )
}

// ------------------ MONO RAIL ------------------
// Standard T-slot aluminum mounting rail with channel
export function MonoRail({ length = 4, ...props }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    // T-slot profile with hollow channel feel
    s.moveTo(-0.35, 0)
    s.lineTo(-0.35, 0.15)
    s.lineTo(-0.12, 0.15)
    s.lineTo(-0.12, 0.40)
    s.lineTo(-0.18, 0.40)
    s.lineTo(-0.18, 0.48)
    s.lineTo(0.18, 0.48)
    s.lineTo(0.18, 0.40)
    s.lineTo(0.12, 0.40)
    s.lineTo(0.12, 0.15)
    s.lineTo(0.35, 0.15)
    s.lineTo(0.35, 0)
    s.lineTo(-0.35, 0)
    return s
  }, [])

  const geometry = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: length,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 3,
    })
    geo.translate(0, 0, -length / 2)
    return geo
  }, [shape, length])

  return (
    <mesh geometry={geometry} castShadow receiveShadow {...props}>
      {aluminumMaterial('#C9D4E0')}
    </mesh>
  )
}

// ------------------ LONG RAIL ------------------
// Heavy-duty extrusion — taller, with internal reinforcement ribs visible on cross-section
export function LongRail({ length = 6, ...props }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    // Tall reinforced profile
    s.moveTo(-0.40, 0)
    s.lineTo(-0.40, 0.20)
    s.lineTo(-0.15, 0.20)
    s.lineTo(-0.15, 0.55)
    s.lineTo(-0.22, 0.55)
    s.lineTo(-0.22, 0.65)
    s.lineTo(0.22, 0.65)
    s.lineTo(0.22, 0.55)
    s.lineTo(0.15, 0.55)
    s.lineTo(0.15, 0.20)
    s.lineTo(0.40, 0.20)
    s.lineTo(0.40, 0)
    s.lineTo(-0.40, 0)
    return s
  }, [])

  const geometry = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: length,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 3,
    })
    geo.translate(0, 0, -length / 2)
    return geo
  }, [shape, length])

  return (
    <mesh geometry={geometry} castShadow receiveShadow {...props}>
      {aluminumMaterial('#C9D4E0')}
    </mesh>
  )
}

// ------------------ L-FOOT (rooftop mount) ------------------
export function LFoot({ ...props }) {
  return (
    <group {...props}>
      {/* Base plate */}
      <mesh castShadow position={[0, 0.03, 0]}>
        <boxGeometry args={[0.6, 0.05, 0.4]} />
        {aluminumMaterial('#8FA0BB')}
      </mesh>
      {/* Vertical riser */}
      <mesh castShadow position={[0, 0.25, 0]}>
        <boxGeometry args={[0.08, 0.4, 0.3]} />
        {aluminumMaterial('#8FA0BB')}
      </mesh>
      {/* Bolt heads */}
      {[-0.2, 0.2].map(x => (
        <mesh key={x} position={[x, 0.07, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.04, 8]} />
          <meshStandardMaterial color="#2A3247" metalness={1} roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

// ------------------ SOLAR PANEL ------------------
export function SolarPanel({ width = 2, height = 1.2, ...props }) {
  return (
    <group {...props}>
      {/* Frame */}
      <mesh castShadow>
        <boxGeometry args={[width, height, 0.06]} />
        <meshStandardMaterial color="#1a1f2e" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* PV surface */}
      <mesh position={[0, 0, 0.031]}>
        <planeGeometry args={[width - 0.06, height - 0.06]} />
        <meshStandardMaterial
          color="#0a1a3e"
          metalness={0.9}
          roughness={0.15}
          emissive="#0a1a3e"
          emissiveIntensity={0.05}
        />
      </mesh>
      {/* Cell grid */}
      {Array.from({ length: 6 }).map((_, col) => (
        Array.from({ length: 10 }).map((_, row) => {
          const cellW = (width - 0.1) / 6
          const cellH = (height - 0.1) / 10
          const x = -((width - 0.1) / 2) + cellW * (col + 0.5)
          const y = -((height - 0.1) / 2) + cellH * (row + 0.5)
          return (
            <mesh key={`${col}-${row}`} position={[x, y, 0.034]}>
              <planeGeometry args={[cellW * 0.94, cellH * 0.94]} />
              <meshStandardMaterial
                color="#0d2451"
                metalness={0.85}
                roughness={0.2}
              />
            </mesh>
          )
        })
      ))}
    </group>
  )
}
