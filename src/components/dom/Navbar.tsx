import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

type NavbarProps = { disabled?: boolean }

export const Navbar: React.FC<NavbarProps> = ({ disabled = false }) => {
  const router = useRouter()
  const [active, setActive] = useState(router.pathname)

  useEffect(() => {
    setActive(router.pathname)
  }, [router.pathname])

  const navItems = [
    { text: 'HOME', path: '/' },
    { text: 'PROJECTS', path: '/projects' },
    { text: 'CONTACT', path: '/contact' },
  ]

  return (
    <nav
      className={`absolute top-0 left-0 right-0 z-20 flex items-center justify-between w-full px-5 pt-5 pb-1 border-b sm:px-10 lg:px-20 text-white/75 border-b-white/20
      ${disabled ? 'pointer-events-none opacity-70' : ''}`}
    >
      <span
        className="text-xl cursor-pointer font-fog mix-blend-difference"
        onClick={() => !disabled && router.push('/')}
        aria-disabled={disabled}
      >
        @rafzhka
      </span>

      <ul className="flex text-sm font-light tracking-wider space-x-4 md:space-x-10 font-ubuntu [&>*]:leading-none [&>*]:transition-all">
        {navItems.map(({ text, path }) => (
          <li key={text} className={active === path ? 'text-white' : 'text-white/75'}>
            <Link
              href={path}
              className="hover:text-white"
              onClick={() => setActive(path)}
              aria-disabled={disabled}
              tabIndex={disabled ? -1 : 0}
            >
              {text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navbar
