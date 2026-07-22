'use client'

import { logout } from '@/app/auth/actions'

export function LogoutButton({
  className = 'btn btn-danger',
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <form action={logout} style={{ margin: 0 }}>
      <button type="submit" className={className} style={style}>
        Logout
      </button>
    </form>
  )
}
