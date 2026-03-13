import { STAGE_ORDER, STAGES } from '@/lib/constants'
import { useMainStore } from '@/stores/main'

export default function FunnelChart() {
  const { opportunities } = useMainStore()

  const stageCounts = STAGE_ORDER.reduce(
    (acc, stageId) => {
      acc[stageId] = opportunities.filter((o) => o.stageId === stageId).length
      return acc
    },
    {} as Record<string, number>,
  )

  const maxCount = Math.max(...Object.values(stageCounts), 1)

  return (
    <div className="flex flex-col gap-2 w-full max-w-2xl mx-auto py-8">
      {STAGE_ORDER.map((stageId, index) => {
        const count = stageCounts[stageId]
        const stage = STAGES[stageId]
        // Create a trapezoid-like effect by reducing the width based on stage order,
        // but keeping it proportional to count for visual data representation if we wanted.
        // For a true funnel, width usually decreases steadily. Let's do steady decrease.
        const widthPercent = 100 - index * 15

        return (
          <div key={stageId} className="flex flex-col items-center group relative">
            <div
              className={`h-16 flex items-center justify-between px-6 transition-all duration-300 hover:opacity-90 shadow-sm`}
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
              <span className="text-white font-semibold">{stage.label}</span>
              <span className="text-white/90 font-bold bg-black/20 px-3 py-1 rounded-full text-sm">
                {count}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
