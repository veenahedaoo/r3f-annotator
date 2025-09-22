// src/components/Model.jsx
import React, { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'      // ✅ from drei
import { useThree } from '@react-three/fiber'    // ✅ from fiber
import { fitCameraToObject } from '../utils/camera'

export default function Model({ url, onClick, controls }) {
  const { scene } = useGLTF(url)
  const { camera } = useThree()

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.geometry) {
        child.geometry.computeBoundsTree?.()
        child.castShadow = true
        child.receiveShadow = true
        child.userData = { clickable: true }
      }
    })

    // Auto-fit camera once the model is loaded
    if (camera && controls?.current) {
      fitCameraToObject(camera, controls.current, scene)
    }
  }, [scene, camera, controls])

  return (
    <primitive
      object={scene}
      onPointerDown={(e) => {
        e.stopPropagation()
        if (onClick) onClick(e)
      }}
    />
  )
}
