import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { GLTF } from 'three-stdlib'
import { Lights } from './Lights'

// "V for Vendetta - Anonymous Mask" (https://skfb.ly/oHWrM) by pixelAlp is licensed under CC-BY-4.0 (NonCommercial).

type GLTFResult = GLTF & {
  nodes: { Object_4: THREE.Mesh }
  materials: { colorcheck: THREE.MeshStandardMaterial }
}

export const Model: React.FC<JSX.IntrinsicElements['group']> = (props) => {
  const group = useRef<THREE.Group>(null)
  const rig = useRef<THREE.Group>(null)
  const { nodes, materials } = useGLTF('/scene.gltf') as GLTFResult
  const { camera } = useThree()

  useEffect(() => {
    if (!rig.current) return
    rig.current.rotation.set(0, 10.5, 0)
  }, [])

  useFrame(({ pointer }) => {
    if (!group.current) return
    const targetY = pointer.x * (Math.PI / 16)
    const targetX = pointer.y * -(Math.PI / 16)
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.08)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.08)
  })

  return (
    <group ref={group} {...props} dispose={null}>
      <group
        ref={rig}
        position={[-4, 7, 0]}
        rotation={[0, 0, 0]}
        scale={12}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_4.geometry}
          material={materials.colorcheck}
        />
      </group>
      <Lights />
    </group>
  )
}

useGLTF.preload('/scene.gltf')
