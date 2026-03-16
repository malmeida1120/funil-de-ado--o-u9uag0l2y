import { Opportunity, Product } from '@/types'
import { Badge } from '@/components/ui/badge'
import { OpportunityCard } from './OpportunityCard'

interface KanbanColumnProps {
  id: string
  title: string
  count: number
  color: string
  bgColor: string
  opps: Opportunity[]
  products: Product[]
  onDrop: (e: React.DragEvent, target: string) => void
  onDragOver: (e: React.DragEvent) => void
  onDragStart: (e: React.DragEvent, oppId: string) => void
  onOppClick: (oppId: string) => void
  isViewer?: boolean
}

export function KanbanColumn({
  id,
  title,
  count,
  color,
  bgColor,
  opps,
  products,
  onDrop,
  onDragOver,
  onDragStart,
  onOppClick,
  isViewer,
}: KanbanColumnProps) {
  return (
    <div
      className={`flex-shrink-0 w-80 rounded-xl border border-slate-200 flex flex-col ${bgColor}`}
      onDrop={(e) => onDrop(e, id)}
      onDragOver={onDragOver}
    >
      <div
        className="h-12 flex items-center px-4 rounded-t-xl shrink-0"
        style={{ borderTop: `4px solid ${color}`, backgroundColor: 'white' }}
      >
        <h3 className="font-semibold text-slate-800 flex-1">{title}</h3>
        <Badge variant="secondary" className="bg-slate-100">
          {count}
        </Badge>
      </div>

      <div className="p-3 flex-1 overflow-y-auto space-y-3">
        {opps.map((opp) => (
          <OpportunityCard
            key={opp.id}
            opp={opp}
            product={products.find((p) => p.id === opp.productId)}
            onClick={() => onOppClick(opp.id)}
            onDragStart={onDragStart}
            isViewer={isViewer}
          />
        ))}
        {opps.length === 0 && (
          <div className="text-center p-4 text-sm text-slate-400 border-2 border-dashed border-slate-200 rounded-lg bg-white/50">
            {isViewer ? 'Nenhuma oportunidade' : 'Arraste cards para cá'}
          </div>
        )}
      </div>
    </div>
  )
}
