'use client'
import { HomePage } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const ProcessStepRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<HomePage['processSteps']>[number]>()

  const label = data?.data?.title
    ? `Step ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${data?.data?.title}`
    : 'Step'

  return <div>{label}</div>
}
