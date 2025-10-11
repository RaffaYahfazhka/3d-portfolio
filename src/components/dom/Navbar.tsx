import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

type NavbarProps = { disabled?: boolean }

export const Navbar: React.FC<NavbarProps> = ({ disabled = false }) => {
  const router = useRouter()

  const navItems = [
    { text: 'HOME', path: '/home' },
    { text: 'PROJECTS', path: '/projects' },
    { text: 'CONTACT', path: '/contact' },
  ]

  const isActive = (path: string) =>
    router.pathname === path || router.asPath.startsWith(path)

  const handleBrandClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault()
      e.stopPropagation()
      return
    }
    router.push('/')
  }

  const handleNavClick =
    (path: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (disabled) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

  return (
    <nav
      className={`absolute top-0 left-0 right-0 z-20 flex items-center justify-between w-full px-5 pt-5 pb-1 border-b sm:px-10 lg:px-20 text-white/75 border-b-white/20
      ${disabled ? 'opacity-70' : ''}`}
    >
      <button
        type="button"
        onClick={handleBrandClick}
        className="text-xl cursor-pointer font-fog mix-blend-difference text-left"
        aria-disabled={disabled}
      >
        @rafzhka
      </button>

      <ul className="flex text-sm font-light tracking-wider space-x-4 md:space-x-10 font-ubuntu [&>*]:leading-none [&>*]:transition-all">
        {navItems.map(({ text, path }) => (
          <li key={text} className={isActive(path) ? 'text-white' : 'text-white/75'}>
            <Link href={path} legacyBehavior passHref>
              <a
                className="hover:text-white"
                onClick={handleNavClick(path)}
                aria-disabled={disabled}
                tabIndex={disabled ? -1 : 0}
              >
                {text}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navbar
