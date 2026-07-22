'use client'

import { useFormStatus } from 'react-dom'
import { deleteSummary } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending} className="btn btn-danger">
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
