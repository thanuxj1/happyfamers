'use client'
import { Product } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const BenefitRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<Product['benefits']>[number]>()

  const label = data?.data?.benefit || 'Benefit'

  return <div>{label}</div>
}
