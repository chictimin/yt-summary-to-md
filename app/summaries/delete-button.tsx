'use client'

import { useFormStatus } from 'react-dom'
import { deleteSummary } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 disabled:opacity-50"
    >
      {pending ? '삭제 중...' : '삭제'}
    </button>
  )
}

export function DeleteButton({ id }: { id: string }) {
  return (
    <form
      action={deleteSummary}
      onSubmit={(e) => {
        if (!confirm('정말 삭제하시겠습니까?')) {
          e.preventDefault()
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <SubmitButton />
    </form>
  )
}
