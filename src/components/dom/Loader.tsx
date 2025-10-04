import React from 'react'
import { a, useSpring } from '@react-spring/web'
import { TypeAnimation } from 'react-type-animation'

interface LoaderProps {
  setUnmount: React.Dispatch<React.SetStateAction<boolean>>
  // untuk CustomLoader
  text?: string
}

/** ====== Terminal-style Loader (Linux-y) ====== */
export const Loader: React.FC<LoaderProps> = ({ setUnmount }) => {
  // Overlay: mulai visible (1), nanti kita turunin ke 0 setelah typing selesai + text fade selesai
  const [overlaySpring, overlayApi] = useSpring(() => ({
    from: { opacity: 1 },
  }))

  // Text container: mulai visible (1), nanti kita fade ke 0 lebih dulu daripada overlay
  const [textSpring, textApi] = useSpring(() => ({
    from: { opacity: 1 },
  }))

  // Saat semua selesai, panggil ini
  const startFadeOut = async () => {
    // 1) Fade text dulu
    await textApi.start({ opacity: 0, config: { duration: 500 } })
    // 2) Lalu fade overlay
    await overlayApi.start({
      opacity: 0,
      config: { duration: 600 },
      onRest: () => setUnmount(true),
    })
  }

  return (
    <a.div
      style={overlaySpring}
      className="absolute inset-0 z-30 flex items-center justify-center w-screen h-screen bg-black"
    >
      <a.div
        style={textSpring}
        className="w-[760px] max-w-[92vw] rounded-2xl overflow-hidden shadow-2xl border border-[#0b3] border-opacity-20"
      >
        {/* Header bar ala terminal */}
        <div className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] border-b border-[#0b3]/20 text-xs text-[#9aa]">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-500" />
          <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
          <span className="ml-3 opacity-70">rafzhka@void: ~</span>
        </div>

        {/* Body terminal */}
        <div
          className="px-5 py-6 bg-[#070707] text-[#0f0] leading-relaxed"
          style={{
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","Courier New", monospace',
            whiteSpace: 'pre-wrap',
          }}
        >
          {`rafzhka@void:~$`} <TypeAnimation
            cursor={false}
            speed={60}
            deletionSpeed={85}
            sequence={[
              'Yo! Welcome to my portfolio guys 👋',
              700,
              () => { },
              "Get ready to be stunned 😎",
              700,
              () => { },
              "Let me introduce myself — I'm Raffa",
              300,
              () => { },
              'A Frontend Developer and football addict ⚽',
              300,
              () => { },
              "I love making you all curious 😎",
              300,
              () => { },
              "Need a cool and stunning website like this one?",
              700,
              () => { },
              "No worries... just contact me now!",
              800,
              () => startFadeOut(),
            ]}
            wrapper="span"
            style={{ fontSize: '1.125rem' }}
            repeat={0}
          />
          {/* Blinking block cursor (█) */}
          <span className="ml-1 inline-block align-baseline">
            <span className="inline-block w-2.5 h-5 bg-[#0f0] animate-pulse" />
          </span>
        </div>
      </a.div>
    </a.div>
  )
}

/** ====== Custom text Loader (pakai text props) ====== */
export const CustomLoader: React.FC<LoaderProps> = ({ setUnmount, text }) => {
  const [overlaySpring, overlayApi] = useSpring(() => ({ from: { opacity: 1 } }))
  const [textSpring, textApi] = useSpring(() => ({ from: { opacity: 1 } }))

  const startFadeOut = async () => {
    await textApi.start({ opacity: 0, config: { duration: 500 } })
    await overlayApi.start({
      opacity: 0,
      config: { duration: 600 },
      onRest: () => setUnmount(true),
    })
  }

  return (
    <a.div
      style={overlaySpring}
      className="absolute inset-0 z-[19] flex items-center justify-center w-screen h-screen bg-black"
    >
      <a.div style={textSpring} className="text-3xl text-white font-mono">
        <TypeAnimation
          cursor={false}
          speed={50}
          sequence={[
            text || '',
            1000,
            () => startFadeOut(),
          ]}
          wrapper="span"
          repeat={0}
        />
        <span className="ml-1 inline-block w-2.5 h-6 bg-white/90 animate-pulse align-baseline" />
      </a.div>
    </a.div>
  )
}
