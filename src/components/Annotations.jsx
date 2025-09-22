import React, { useState, useEffect } from 'react'
import { Html } from '@react-three/drei'
import { useAppStore } from './ControlsPanel'
import * as THREE from 'three'

function lineLength(points) {
  let length = 0
  for (let i = 0; i < points.length - 1; i++) {
    length += points[i].distanceTo(points[i + 1])
  }
  return length
}

function polygonArea3D(points) {
  if (points.length < 3) return 0
  const normal = new THREE.Vector3(0, 0, 0)
  for (let i = 0; i < points.length; i++) {
    const a = points[i]
    const b = points[(i + 1) % points.length]
    normal.x += (a.y - b.y) * (a.z + b.z)
    normal.y += (a.z - b.z) * (a.x + b.x)
    normal.z += (a.x - b.x) * (a.y + b.y)
  }
  normal.normalize()
  const u = new THREE.Vector3().subVectors(points[1], points[0]).normalize()
  const v = new THREE.Vector3().crossVectors(normal, u).normalize()
  const coords = points.map((p) => [p.dot(u), p.dot(v)])
  let area = 0
  for (let i = 0; i < coords.length; i++) {
    const [x1, y1] = coords[i]
    const [x2, y2] = coords[(i + 1) % coords.length]
    area += x1 * y2 - x2 * y1
  }
  return Math.abs(area) / 2
}

export default function Annotations() {
  const { mode, color } = useAppStore()

  const [pointAnnotations, setPointAnnotations] = useState([])
  const [lineAnnotations, setLineAnnotations] = useState([])
  const [polygonAnnotations, setPolygonAnnotations] = useState([])

  const [currentLine, setCurrentLine] = useState([])
  const [currentPolygon, setCurrentPolygon] = useState([])
  const [previewPoint, setPreviewPoint] = useState(null)

  useEffect(() => {
    const handleMeshClick = (e) => {
      const { point } = e.detail

      if (mode === 'point') {
        setPointAnnotations((prev) => [...prev, point])
      }
      if (mode === 'line') {
        setCurrentLine((prev) => [...prev, point])
      }
      if (mode === 'polygon') {
        setCurrentPolygon((prev) => [...prev, point])
      }
    }

    const handleDoubleClick = () => {
      if (mode === 'line' && currentLine.length >= 2) {
        setLineAnnotations((prev) => [...prev, currentLine])
        setCurrentLine([])
        setPreviewPoint(null)
      }
      if (mode === 'polygon' && currentPolygon.length >= 3) {
        setPolygonAnnotations((prev) => [...prev, currentPolygon])
        setCurrentPolygon([])
        setPreviewPoint(null)
      }
    }

    window.addEventListener('mesh-click', handleMeshClick)
    window.addEventListener('dblclick', handleDoubleClick)

    return () => {
      window.removeEventListener('mesh-click', handleMeshClick)
      window.removeEventListener('dblclick', handleDoubleClick)
    }
  }, [mode, currentLine, currentPolygon])

  return (
    <>
      {/* POINTS */}
      {pointAnnotations.map((p, i) => (
        <mesh key={`pt-${i}`} position={p}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}

      {/* FINALIZED LINES */}
      {lineAnnotations.map((line, idx) => (
        <React.Fragment key={`line-${idx}`}>
          {/* spheres at vertices */}
          {line.map((p, i) => (
            <mesh key={`linept-${idx}-${i}`} position={p}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial color={color} />
            </mesh>
          ))}

          {/* line */}
          <line>
            <bufferGeometry attach="geometry" setFromPoints={line} />
            <lineBasicMaterial color={color} />
          </line>

          {/* length label */}
          <Html position={line[Math.floor(line.length / 2)]}>
            <div
              style={{
                background: 'rgba(255,255,255,0.9)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '11px',
                color: 'black',
                border: '1px solid #333',
              }}
            >
              {lineLength(line).toFixed(2)} m
            </div>
          </Html>
        </React.Fragment>
      ))}

      {/* FINALIZED POLYGONS */}
      {polygonAnnotations.map((poly, idx) => {
        const shape = new THREE.Shape(poly.map((p) => new THREE.Vector2(p.x, p.y)))
        return (
          <React.Fragment key={`poly-${idx}`}>
            {/* outline */}
            <line>
              <bufferGeometry attach="geometry" setFromPoints={poly.concat([poly[0]])} />
              <lineBasicMaterial color={color} />
            </line>

            {/* filled polygon */}
            <mesh>
              <shapeGeometry args={[shape]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* finalized polygon vertices (spheres) */}
            {poly.map((p, i) => (
              <mesh key={`polypt-${idx}-${i}`} position={p}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshStandardMaterial color={color} />
              </mesh>
            ))}

            {/* area label */}
            <Html position={poly[Math.floor(poly.length / 2)]}>
              <div
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  color: 'black',
                  border: '1px solid #333',
                }}
              >
                {polygonArea3D(poly).toFixed(2)} m²
              </div>
            </Html>
          </React.Fragment>
        )
      })}

      {/* LINE PREVIEW */}
      {mode === 'line' && currentLine.length > 0 && (
        <>
          {/* orange spheres at in-progress line vertices */}
          {currentLine.map((p, i) => (
            <mesh key={`cline-${i}`} position={p}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial color="orange" />
            </mesh>
          ))}

          {/* preview line */}
          {previewPoint && (
            <line>
              <bufferGeometry
                attach="geometry"
                setFromPoints={[...currentLine, previewPoint]}
              />
              <lineBasicMaterial color="orange" />
            </line>
          )}
        </>
      )}

      {/* POLYGON PREVIEW */}
      {mode === 'polygon' && currentPolygon.length > 0 && (
        <>
          {/* orange spheres at in-progress polygon points */}
          {currentPolygon.map((p, i) => (
            <mesh key={`cpp-${i}`} position={p}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial color="orange" />
            </mesh>
          ))}

          {/* preview outline */}
          {previewPoint && (
            <line>
              <bufferGeometry
                attach="geometry"
                setFromPoints={[...currentPolygon, previewPoint]}
              />
              <lineBasicMaterial color="orange" />
            </line>
          )}
        </>
      )}
    </>
  )
}
