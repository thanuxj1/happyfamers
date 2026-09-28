'use client'
import { HomePage } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const WhyChooseItemRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<HomePage['whyChooseItems']>[number]>()

  const label = data?.data?.text || 'Item'

  return <div>{label}</div>
}
