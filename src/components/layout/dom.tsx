import { useEffect, useRef, useState } from 'react'
import useStore from '@/helpers/store'
import { Loader } from '@/components/dom/Loader'
import { Navbar } from '../dom/Navbar'
import { useRouter } from 'next/router'

const Dom = ({ children }) => {
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    useStore.setState({ dom: ref })
  }, [])

  const [unmount, setUnmount] = useState<boolean>(false)
  const router = useRouter()
  const path = router.pathname

  // loader aktif hanya di halaman "/"
  const isLoaderActive = path === '/' && !unmount

  // atur z-index container konten
  const [zIndex, setZIndex] = useState('z-10')
  useEffect(() => {
    if (path !== '/') {
      if (path === '/contact' && unmount) setZIndex('z-10')
      else setZIndex('z-12')
    } else {
      setZIndex(isLoaderActive ? 'z-[100]' : 'z-10') // naikin saat loader aktif
    }
  }, [path, unmount, isLoaderActive])

  // opsional: kunci scroll body saat loader aktif
  useEffect(() => {
    if (isLoaderActive) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = prev }
    }
  }, [isLoaderActive])

  return (
    <>
      {/* kirim prop disabled ke Navbar */}
      {!isLoaderActive && <Navbar />}

      <div
        className={`${zIndex} absolute top-0 left-0 w-screen h-screen px-5 mx-auto overflow-hidden sm:px-10 lg:px-20 dom`}
        ref={ref}
      >
        {isLoaderActive ? <Loader setUnmount={setUnmount} /> : null}
        {children}
      </div>
    </>
  )
}

export default Dom
