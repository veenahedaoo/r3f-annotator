// src/utils/math3d.js
import * as THREE from 'three';

export function polygonArea3D(points) {
  if (points.length < 3) return 0;
  // compute best-fit normal (Newell's method)
  const normal = new THREE.Vector3(0,0,0);
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    normal.x += (a.y - b.y) * (a.z + b.z);
    normal.y += (a.z - b.z) * (a.x + b.x);
    normal.z += (a.x - b.x) * (a.y + b.y);
  }
  normal.normalize();

  // compute basis (u, v) on plane
  const u = new THREE.Vector3().subVectors(points[1], points[0]).normalize();
  const v = new THREE.Vector3().crossVectors(normal, u).normalize();

  // project to 2D and compute shoelace
  const coords = points.map(p => [p.dot(u), p.dot(v)]);
  let area = 0;
  for (let i = 0; i < coords.length; i++) {
    const [x1, y1] = coords[i];
    const [x2, y2] = coords[(i + 1) % coords.length];
    area += x1 * y2 - x2 * y1;
  }
  return Math.abs(area) * 0.5; // area in same units^2
}
