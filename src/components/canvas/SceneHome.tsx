import * as THREE from 'three'
import { Vector3 } from 'three'

import { useFrame, useThree } from '@react-three/fiber'
import { Html, PerspectiveCamera, Sparkles, Text } from '@react-three/drei'
import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'

import useStore from '@/helpers/store'
import { FiArrowUpRight } from 'react-icons/fi'

import { Model } from './Model'

export const HomeOverlay = () => {
  const router = useStore((s) => s.router)

  return (
    <main className='relative flex flex-col h-full'>
      <div className='flex flex-col items-center justify-between h-full py-36 md:py-32'>
        <span className='text-base font-light uppercase pointer-events-none md:text-xl md:relative md:self-start indent-10 text-white/50 font-ubuntu whitespace-nowrap top-28'>
          Hey I&apos;m &nbsp;
          <h1 className='inline text-2xl italic normal-case md:text-3xl text-white/60 font-fog'>
            Muhammad Raffa Yahfazhka.
          </h1>{' '}
          <br />A <span className='italic'>Front-End</span>&nbsp; Developer
          Based in <br />
          Indonesia.
        </span>
        <div className='flex flex-col items-center pointer-events-none md:self-end md:items-start'>
          <h2 className='relative italic lg:text-8xl text-[10vw] text-white/60 font-fog right-5'>
            <span className='relative lg:text-9xl left-2 text-[11vw]'>F</span>
            rontend&nbsp;
            <span className='lg:text-9xl text-[11vw]'>D</span>e
            <span className='font-light font-ubuntu'>v</span>
          </h2>
          <div className='flex flex-col justify-around md:flex-row'>
            <span className='text-base font-light uppercase md:text-xl text-white/50 font-ubuntu indent-10 whitespace-nowrap'>
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; I Develop
              Web & Mobile App.
              <br />
              Web & Mobile App Development and <br /> Integration.
            </span>
            <button
              onClick={() => router.push('/projects')}
              className='relative flex items-center self-end text-2xl italic font-light leading-none tracking-wider pointer-events-auto text-white/70 right-5 bottom-2 transition-all font-fog hover-effect'
            >
              Projects
              <FiArrowUpRight />
            </button>
          </div>
        </div>
      </div>
      <Socials />
    </main>
  )
}

const Socials: React.FC = () => {
  return (
    <ul className='left-0 flex justify-center w-full mb-10 text-sm font-light tracking-widest md:absolute bottom-10 text-white/70 space-x-5 font-ubuntu [&>li]:flex [&>li]:items-center [&>li]:cursor-pointer [&>li]:transition-all md:justify-start md:mb-0'>
      <li className=' hover:text-white'>
        <a href='https://github.com/RaffaYahfazhka' target='_blank' rel='noopener noreferrer'>GITHUB</a>
        <FiArrowUpRight />
      </li>
      <li className=' hover:text-white'>
        <a href='https://www.linkedin.com/in/rafzhka' target='_blank' rel='noopener noreferrer'>LINKEDIN</a>
        <FiArrowUpRight />
      </li>
    </ul>
  )
}

const SceneHome = ({ }) => {
  useFrame((state) => {
    state.camera.position.lerp({ x: 0, y: 0, z: 12 } as Vector3, 0.005)
    state.camera.lookAt(0, 0, 0)
  })

  return (
    <>
      <Html fullscreen transform={false} pointerEvents='auto' style={{ padding: '0 60px' }}>
        <HomeOverlay />
      </Html>

      <PerspectiveCamera makeDefault position={[0, 0, 14]} fov={55} near={0.1} far={100} />

      <color attach='background' args={['#050505']} />
      <fog attach='fog' args={[0x050505, 0, 28]} />
      <pointLight position={[0, 10, -7]} intensity={1} />


      <Model position={[6, -6, 0]} rotation={[0, -0.2, 0]} />
      <Title>{`Who Am I ?`}</Title>
      <TitleL>{`Who Am I ?`}</TitleL>
      <Sparkles count={60} scale={[20, 20, 10]} size={1} speed={2} />

      <EffectComposer multisampling={0} disableNormalPass={true}>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} opacity={2} />
        <Noise opacity={0.025} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>

      <Rig />
    </>
  )
}

const Title = ({ children }) => {
  const { width } = useThree((state) => state.viewport)
  return (
    <Text
      position={[0, 0, -10]}
      lineHeight={1.3}
      font='/FogtwoNo5.otf'
      fontSize={width / 5}
      material-toneMapped={false}
      anchorX='center'
      anchorY='middle'
    >
      {children}
      <meshBasicMaterial color='#c4c4c4' />
    </Text>
  )
}

const TitleL = ({ children }) => {
  const { width } = useThree((state) => state.viewport)
  return (
    <Text
      position={[0, 0, -10]}
      lineHeight={1.3}
      font='/FogtwoNo5.otf'
      fontSize={width / 5}
      material-toneMapped={false}
      anchorX='center'
      anchorY='middle'
    >
      {children}
      <meshStandardMaterial roughness={1} metalness={0.5} color='#474747' />
    </Text>
  )
}

const Rig = ({ v = new THREE.Vector3() }) => {
  return useFrame((state) => {
    state.camera.position.lerp(
      v.set(-state.mouse.x / 2, state.mouse.y / 2, 10),
      0.05
    )
  })
}

export default SceneHome
