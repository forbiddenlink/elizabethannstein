import * as THREE from 'three'

/**
 * Default camera for the whole map. Distance scales with aspect ratio so the ring of galaxies
 * fits the width on a phone as well as on a desktop. Shared by the fly-to controller and the
 * intro/tour sequences so none of them snaps back to a tighter view.
 */
export function getUniverseCamera(aspect: number): THREE.Vector3 {
  const distance = Math.min(330, Math.max(105, 200 / Math.max(aspect, 0.3)))
  // Portrait screens have height to spare, so look down steeper and let the ring fill it.
  const portrait = aspect < 1
  return new THREE.Vector3(
    0,
    distance * (portrait ? 0.75 : 0.45),
    distance * (portrait ? 0.66 : 0.89)
  )
}
