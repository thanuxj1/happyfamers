'use client'
import { HomePage } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const ImpactItemRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<HomePage['impactItems']>[number]>()

  const label = data?.data?.title || 'Tile'

  return <div>{label}</div>
}

