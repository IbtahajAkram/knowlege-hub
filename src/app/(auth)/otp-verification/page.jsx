// app/(auth)/otp-verification/page.tsx ya .js
import React, { Suspense } from 'react'
import OtpVerificationPage from '../../../components/otpPage'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtpVerificationPage />
    </Suspense>
  )
}
