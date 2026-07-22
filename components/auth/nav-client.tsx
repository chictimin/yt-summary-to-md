'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LogoutButton } from './logout-button'

export function NavClient({ userEmail }: { userEmail: string | null }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="bar">
        <Link href="/" className="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <rect width="24" height="24" className="logo-rect" />
            <path d="M9 7 L17 12 L9 17 Z" className="logo-tri" />
          </svg>
          yt2md
        </Link>

        <nav className="nav-desktop">
          {userEmail ? (
            <>
              <span className="nav-user">{userEmail}</span>
              <Link href="/settings">Settings</Link>
              <LogoutButton style={{ padding: '9px 18px' }} />
            </>
          ) : (
            <>
              <Link href="/auth/login">Login</Link>
              <Link href="/auth/signup" className="btn btn-primary" style={{ padding: '9px 18px' }}>
                Signup
              </Link>
            </>
          )}
        </nav>

        <button className="hamburger" aria-label="메뉴 열기" onClick={() => setOpen((o) => !o)}>
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`mobile-menu${open ? ' open' : ''}`}>
        {userEmail ? (
          <>
            <span className="nav-user" style={{ padding: '8px 4px 2px' }}>
              {userEmail}
            </span>
            <Link href="/settings" onClick={() => setOpen(false)}>
              Settings
            </Link>
            <LogoutButton className="danger" />
          </>
        ) : (
          <>
            <Link href="/auth/login" onClick={() => setOpen(false)}>
              Login
            </Link>
            <Link href="/auth/signup" onClick={() => setOpen(false)}>
              Signup
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
