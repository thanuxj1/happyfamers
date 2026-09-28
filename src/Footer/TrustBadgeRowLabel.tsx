'use client'
import { Footer } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const TrustBadgeRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<Footer['trustBadges']>[number]>()

  const label = data?.data?.label
    ? `Badge ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${data?.data?.label}`
    : 'Badge'

  return <div>{label}</div>
}
