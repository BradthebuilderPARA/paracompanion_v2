import React from 'react'
import { LegalLayout } from '@/components/legal/LegalLayout'
import { LegalDocument } from '@/components/legal/LegalDocument'
import { LEGAL_CONTENT } from '@/lib/legal/legal-data'

export default function TermsOfServicePage() {
  return (
    <LegalLayout>
      <LegalDocument content={LEGAL_CONTENT.termsOfService} />
    </LegalLayout>
  )
}
