'use client'

import { logout } from '@/app/auth/actions'

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
      >
        Logout
      </button>
    </form>
  )
}
