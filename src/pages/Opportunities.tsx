import { useState, useMemo } from 'react'
import { useMainStore } from '@/stores/main'
import { STAGE_ORDER, STAGES, STAGE_CHECKLISTS } from '@/lib/constants'
import { StageId } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Download, Clock } from 'lucide-react'
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
import { cn } from '@/lib/utils'

export default function Opportunities() {
  const { opportunities, moveOpportunity, products } = useMainStore()
  const { toast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedOppId, setSelectedOppId] = useState<string | null>(null)

  const [selectedProductId, setSelectedProductId] = useState<string>('ALL')
  const [selectedClients, setSelectedClients] = useState<string[]>([])

  const isNewOpen = searchParams.get('new') === 'true'

  const uniqueClients = useMemo(() => {
    const clients = new Set(opportunities.map((o) => o.clientName))
    return Array.from(clients).sort()
  }, [opportunities])

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      const matchProduct = selectedProductId === 'ALL' || opp.productId === selectedProductId
      const matchClient = selectedClients.length === 0 || selectedClients.includes(opp.clientName)
      return matchProduct && matchClient
    })
  }, [opportunities, selectedProductId, selectedClients])

  const closeModals = () => {
    setSelectedOppId(null)
    if (isNewOpen) setSearchParams({})
  }

  const handleDragStart = (e: React.DragEvent, oppId: string) => {
    e.dataTransfer.setData('oppId', oppId)
  }

  const handleDrop = (e: React.DragEvent, targetStage: StageId) => {
    e.preventDefault()
    const oppId = e.dataTransfer.getData('oppId')
    const opp = opportunities.find((o) => o.id === oppId)
    if (!opp) return

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

    moveOpportunity(oppId, targetStage)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val)

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
          const stageOpps = filteredOpportunities.filter((o) => o.stageId === stageId)

          return (
            <div
              key={stageId}
              className="flex-shrink-0 w-80 bg-slate-100/50 rounded-xl border border-slate-200 flex flex-col"
              onDrop={(e) => handleDrop(e, stageId)}
              onDragOver={handleDragOver}
            >
              <div
                className="h-12 flex items-center px-4 rounded-t-xl shrink-0"
                style={{ borderTop: `4px solid ${stage.hexColor}`, backgroundColor: 'white' }}
              >
                <h3 className="font-semibold text-slate-800 flex-1">{stage.label}</h3>
                <Badge variant="secondary" className="bg-slate-100">
                  {stageOpps.length}
                </Badge>
              </div>

              <div className="p-3 flex-1 overflow-y-auto space-y-3">
                {stageOpps.map((opp) => {
                  const product = products.find((p) => p.id === opp.productId)
                  const requiredActs = STAGE_CHECKLISTS[stageId] || []
                  const completedActs = (opp.completedActivities || []).filter((a) =>
                    requiredActs.includes(a),
                  )
                  const progress = requiredActs.length
                    ? (completedActs.length / requiredActs.length) * 100
                    : 100
                  const finalWin = Math.round(((opp.qualitativeWin || 0) + stage.winPercentage) / 2)

                  return (
                    <Card
                      key={opp.id}
                      className={cn(
                        'cursor-pointer hover:shadow-md transition-shadow active:cursor-grabbing border-slate-200',
                        opp.status === 'WON' && 'border-green-500 bg-green-50/50',
                        opp.status === 'LOST' && 'border-red-500 bg-red-50/50',
                      )}
                      draggable
                      onDragStart={(e) => handleDragStart(e, opp.id)}
                      onClick={() => setSelectedOppId(opp.id)}
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-semibold text-slate-900 leading-tight">
                            {opp.clientName}
                          </span>
                          {opp.status === 'WON' && (
                            <Badge className="bg-green-500 hover:bg-green-600 shrink-0 text-[10px] px-1.5 py-0">
                              Ganha
                            </Badge>
                          )}
                          {opp.status === 'LOST' && (
                            <Badge
                              variant="destructive"
                              className="shrink-0 text-[10px] px-1.5 py-0"
                            >
                              Perdida
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 font-medium px-2 py-1 bg-slate-100 rounded inline-block">
                          {product?.name || 'Sem Produto'}
                        </div>
                        <div className="flex justify-between items-end text-sm">
                          <div className="flex flex-col">
                            <span className="text-slate-400 text-xs">Potencial</span>
                            <span className="font-medium text-slate-700">
                              {formatCurrency(opp.potentialValue)}
                            </span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-slate-400 text-xs">Prob. Final</span>
                            <span
                              className={`font-bold ${finalWin > 60 ? 'text-green-600' : finalWin > 30 ? 'text-amber-500' : 'text-red-500'}`}
                            >
                              {finalWin}%
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-500">
                            <span>Checklist da Fase</span>
                            <span>
                              {completedActs.length}/{requiredActs.length}
                            </span>
                          </div>
                          <Progress value={progress} className="h-1.5" />
                        </div>
                        <div className="flex items-center text-[10px] text-slate-400 mt-2 border-t pt-2 border-slate-100">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>
                            Atualizado: {new Date(opp.updatedAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
                {stageOpps.length === 0 && (
                  <div className="text-center p-4 text-sm text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                    Arraste cards para cá
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <OpportunityModal
        isOpen={!!selectedOppId || isNewOpen}
        onClose={closeModals}
        opportunityId={selectedOppId}
      />
    </div>
  )
}
