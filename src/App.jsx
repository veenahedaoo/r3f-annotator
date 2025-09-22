// src/App.jsx
import React, { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Html, useProgress } from '@react-three/drei'
import * as THREE from 'three'
import Model from './components/Model'
import Annotations from './components/Annotations'
import ControlsPanel, { useAppStore } from './components/ControlsPanel'

function Loader() {
  const { progress } = useProgress()
  return <Html center>{progress.toFixed(0)}%</Html>
}

export default function App() {
  const { lightIntensity, lightColor } = useAppStore()  // ✅ get from Leva store
  const controlsRef = useRef()

  return (
    <>
      <ControlsPanel />
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 90 }} style={{ width: '100vw', height: "fit-content" }}>
        {/* Ambient light stays constant */}
        <ambientLight intensity={0.4} />

        {/* Directional light controlled by Leva */}
        <directionalLight
          position={[10, 10, 10]}
          intensity={lightIntensity}
          color={lightColor}
          castShadow
        />

        <Suspense fallback={<Loader />}>
          <Model
            url="/drone.glb"
            controls={controlsRef}
            onClick={(e) => {
              const { point, face, object } = e
              console.log('✅ Mesh clicked at:', point)

              const normal = face.normal
                .clone()
                .applyMatrix3(new THREE.Matrix3().getNormalMatrix(object.matrixWorld))
                .normalize()

              window.dispatchEvent(
                new CustomEvent('mesh-click', { detail: { point, normal } })
              )
            }}
          />
        </Suspense>

        <Annotations />
        <OrbitControls ref={controlsRef} makeDefault />
      </Canvas>
    </>
  )
}
