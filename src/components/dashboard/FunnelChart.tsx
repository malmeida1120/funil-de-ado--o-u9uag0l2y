import { STAGE_ORDER, STAGES } from '@/lib/constants'
import { Opportunity } from '@/types'

interface FunnelChartProps {
  opportunities: Opportunity[]
}

export default function FunnelChart({ opportunities }: FunnelChartProps) {
  const stageData = STAGE_ORDER.reduce(
    (acc, stageId) => {
      const opps = opportunities.filter((o) => o.stageId === stageId)
      acc[stageId] = {
        count: opps.length,
        totalValue: opps.reduce((sum, o) => sum + o.potentialValue, 0),
      }
      return acc
    },
    {} as Record<string, { count: number; totalValue: number }>,
  )

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val)

  return (
    <div className="flex flex-col gap-2 w-full max-w-2xl mx-auto py-4">
      {STAGE_ORDER.map((stageId, index) => {
        const data = stageData[stageId]
        const stage = STAGES[stageId]
        // Create a trapezoid-like effect by reducing the width based on stage order
        const widthPercent = 100 - index * 15

        return (
          <div key={stageId} className="flex flex-col items-center group relative">
            <div
              className={`h-20 flex items-center justify-between px-6 transition-all duration-300 hover:opacity-90 shadow-sm`}
              style={{
                width: `${widthPercent}%`,
                backgroundColor: stage.hexColor,
                clipPath:
                  index < STAGE_ORDER.length - 1
                    ? 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)'
                    : 'none',
                borderRadius: index === STAGE_ORDER.length - 1 ? '0 0 8px 8px' : '0',
              }}
            >
              <div className="flex flex-col">
                <span className="text-white font-semibold">{stage.label}</span>
                <span className="text-white/80 text-xs font-medium">
                  {formatCurrency(data.totalValue)}
                </span>
              </div>
              <span className="text-white/90 font-bold bg-black/20 px-3 py-1 rounded-full text-sm">
                {data.count}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
