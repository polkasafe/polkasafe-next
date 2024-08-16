import { LOGIN_URL } from '@substrate/app/global/end-points'
import { getUserFromCookie } from '@substrate/app/global/lib/cookies'
import { redirect } from 'next/navigation'
import React, { PropsWithChildren } from 'react'

export default function Secure({children}: PropsWithChildren) {
  const user = getUserFromCookie()
  if (!user) {
    redirect(LOGIN_URL)
  }
  return children
}
