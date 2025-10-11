// import React from 'react'
// import { HomeOverlay } from '@/components/dom/HomeOverlay'
// import dynamic from 'next/dynamic'

// const SceneHome = dynamic(() => import('@/components/canvas/SceneHome'), {
//   ssr: false,
// })

// const Page = (props) => {
//   return (
//     <>
//       <HomeOverlay />
//     </>
//   )
// }

// Page.r3f = (props) => (
//   <>
//     <SceneHome />
//   </>
// )

// export default Page

// export async function getStaticProps() {
//   return {
//     props: {
//       title: 'Raffa Yahfazhka Portfolio',
//     },
//   }
// }


import { CustomLoader } from '@/components/dom/Loader'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
// import Shader from '@/components/canvas/Shader/Shader'

const SceneHome = dynamic(
  () => import('@/components/canvas/SceneHome'),
  {
    ssr: false,
  }
)

const Page = (props) => {
  const [unmount, setUnmount] = useState<boolean>(false)

  return (
    <>
     {!unmount && <CustomLoader setUnmount={setUnmount} text='Home' />}
    </>
  )
}

// It will receive same props as Page component (from getStaticProps, etc.)
Page.r3f = (props) => (
  <>
    <SceneHome />
  </>
)

export default Page

export async function getStaticProps() {
  return {
    props: {
      title: 'Raffa Yahfazhka | Home',
    },
  }
}
