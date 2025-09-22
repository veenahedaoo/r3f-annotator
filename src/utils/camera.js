// src/utils/camera.js
import * as THREE from 'three'

export function fitCameraToObject(camera, controls, object, offset = 1.25) {
  const box = new THREE.Box3().setFromObject(object)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())

  // calculate distance for camera
  const maxDim = Math.max(size.x, size.y, size.z)
  const fov = (camera.fov * Math.PI) / 180
  let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2))

  cameraZ *= offset

  camera.position.set(center.x, center.y, center.z + cameraZ)
  camera.lookAt(center)

  // update clipping planes
  camera.near = cameraZ / 100
  camera.far = cameraZ * 100
  camera.updateProjectionMatrix()

  // orbit controls
  if (controls) {
    controls.target.copy(center)
    controls.update()
  }
}
