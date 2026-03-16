import { useState, useMemo } from 'react'
import { useMainStore } from '@/stores/main'
import { useAuth } from '@/hooks/use-auth'
import { STAGE_ORDER, STAGES, STAGE_CHECKLISTS } from '@/lib/constants'
import { StageId } from '@/types'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { OpportunityModal } from '@/components/kanban/OpportunityModal'
import { useSearchParams } from 'react-router-dom'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ClientFilter } from '@/components/shared/ClientFilter'
import { exportOpportunities } from '@/lib/export'
import { KanbanColumn } from '@/components/kanban/KanbanColumn'

export default function Opportunities() {
  const { opportunities, updateOpportunity, products } = useMainStore()
  const { profile } = useAuth()
  const isViewer = profile?.role === 'viewer'
  const { toast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedOppId, setSelectedOppId] = useState<string | null>(null)

  const [selectedProductId, setSelectedProductId] = useState<string>('ALL')
  const [selectedClients, setSelectedClients] = useState<string[]>([])

  const isNewOpen = searchParams.get('new') === 'true' && !isViewer

  const uniqueClients = useMemo(() => {
    const clients = new Set(opportunities.map((o) => o.title))
    return Array.from(clients).sort()
  }, [opportunities])

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      const matchProduct = selectedProductId === 'ALL' || opp.productId === selectedProductId
      const matchClient = selectedClients.length === 0 || selectedClients.includes(opp.title)
      return matchProduct && matchClient
    })
  }, [opportunities, selectedProductId, selectedClients])

  const closeModals = () => {
    setSelectedOppId(null)
    if (isNewOpen) setSearchParams({})
  }

  const handleDragStart = (e: React.DragEvent, oppId: string) => {
    if (isViewer) return e.preventDefault()
    e.dataTransfer.setData('oppId', oppId)
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (isViewer) return

    const oppId = e.dataTransfer.getData('oppId')
    const opp = opportunities.find((o) => o.id === oppId)
    if (!opp) return

    if (targetId === 'WON' || targetId === 'LOST') {
      updateOpportunity(oppId, { status: targetId as 'WON' | 'LOST' })
      return
    }

    const targetStage = targetId as StageId
    const currentStageIdx = STAGE_ORDER.indexOf(opp.stageId)
    const targetStageIdx = STAGE_ORDER.indexOf(targetStage)

    if (targetStageIdx > currentStageIdx) {
      const requiredActivities = STAGE_CHECKLISTS[opp.stageId] || []
      const completed = opp.completedActivities || []
      const missing = requiredActivities.filter((a) => !completed.includes(a))

      if (missing.length > 0) {
        toast({
          title: 'Ação bloqueada',
          description: `Conclua todas as atividades da fase ${STAGES[opp.stageId].label} antes de avançar.`,
          variant: 'destructive',
        })
        return
      }
    }

    updateOpportunity(oppId, { stageId: targetStage, status: 'ACTIVE' })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const wonOpps = filteredOpportunities.filter((o) => o.status === 'WON')
  const lostOpps = filteredOpportunities.filter((o) => o.status === 'LOST')

  return (
    <div className="h-full flex flex-col animate-fade-in space-y-4">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shrink-0">
        <h2 className="text-2xl font-bold tracking-tight">Pipeline de Oportunidades</h2>
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full lg:w-auto">
          <div className="w-full sm:w-auto">
            <ClientFilter
              options={uniqueClients}
              selected={selectedClients}
              onChange={setSelectedClients}
            />
          </div>
          <div className="w-full sm:w-64">
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Filtrar por Produto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos os Produtos</SelectItem>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            className="w-full sm:w-auto bg-white"
            onClick={() => exportOpportunities(filteredOpportunities, products)}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
        {STAGE_ORDER.map((stageId) => {
          const stage = STAGES[stageId]
          const stageOpps = filteredOpportunities.filter(
            (o) => o.stageId === stageId && (o.status === 'ACTIVE' || !o.status),
          )

          return (
            <KanbanColumn
              key={stageId}
              id={stageId}
              title={stage.label}
              count={stageOpps.length}
              color={stage.hexColor}
              bgColor="bg-slate-100/50"
              opps={stageOpps}
              products={products}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragStart={handleDragStart}
              onOppClick={setSelectedOppId}
              isViewer={isViewer}
            />
          )
        })}

        <KanbanColumn
          id="WON"
          title="Encerradas Ganhas"
          count={wonOpps.length}
          color="#22c55e"
          bgColor="bg-green-50/50"
          opps={wonOpps}
          products={products}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
          onOppClick={setSelectedOppId}
          isViewer={isViewer}
        />

        <KanbanColumn
          id="LOST"
          title="Encerradas Perdidas"
          count={lostOpps.length}
          color="#ef4444"
          bgColor="bg-red-50/50"
          opps={lostOpps}
          products={products}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
          onOppClick={setSelectedOppId}
          isViewer={isViewer}
        />
      </div>

      <OpportunityModal
        isOpen={!!selectedOppId || isNewOpen}
        onClose={closeModals}
        opportunityId={selectedOppId}
      />
    </div>
  )
}
