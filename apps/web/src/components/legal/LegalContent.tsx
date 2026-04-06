import React from 'react'
import { LegalDocument } from './LegalDocument'
import { LEGAL_CONTENT } from '@/lib/legal/legal-data'

export const PrivacyPolicyContent = () => (
  <LegalDocument 
    content={LEGAL_CONTENT.privacyPolicy} 
    fullPageHref="/privacy-policy"
  />
)

export const TermsOfServiceContent = () => (
  <LegalDocument 
    content={LEGAL_CONTENT.termsOfService} 
    fullPageHref="/terms-of-service"
  />
)

export const CookiePolicyContent = () => (
  <LegalDocument 
    content={LEGAL_CONTENT.cookiePolicy} 
    fullPageHref="/cookie-policy"
  />
)

export const BillingTermsContent = () => (
  <LegalDocument 
    content={LEGAL_CONTENT.billingTerms} 
    fullPageHref="/billing-terms"
  />
)
