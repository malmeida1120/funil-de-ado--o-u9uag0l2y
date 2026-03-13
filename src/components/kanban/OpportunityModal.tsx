import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { useMainStore } from '@/stores/main'
import { Opportunity, StageId } from '@/types'
import { STAGE_CHECKLISTS, STAGES, STAGE_ORDER } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'

interface OpportunityModalProps {
  isOpen: boolean
  onClose: () => void
  opportunityId?: string | null
}

export function OpportunityModal({ isOpen, onClose, opportunityId }: OpportunityModalProps) {
  const { opportunities, products, addOpportunity, updateOpportunity } = useMainStore()

  const [formData, setFormData] = useState<Partial<Opportunity>>({
    clientName: '',
    productId: '',
    stageId: 'LEAD',
    potentialValue: 0,
    estimatedDate: '',
    qualitativeWin: 50,
    completedActivities: [],
  })

  useEffect(() => {
    if (opportunityId && isOpen) {
      const opp = opportunities.find((o) => o.id === opportunityId)
      if (opp) setFormData(opp)
    } else if (!opportunityId && isOpen) {
      setFormData({
        clientName: '',
        productId: '',
        stageId: 'LEAD',
        potentialValue: 0,
        estimatedDate: '',
        qualitativeWin: 50,
        completedActivities: [],
      })
    }
  }, [opportunityId, isOpen, opportunities])

  const currentStageId = formData.stageId as StageId
  const stageInfo = STAGES[currentStageId]
  const finalWin = Math.round(
    ((formData.qualitativeWin || 0) + (stageInfo?.winPercentage || 0)) / 2,
  )
  const checklist = STAGE_CHECKLISTS[currentStageId] || []

  const handleSave = () => {
    if (!formData.clientName || !formData.productId) return // Basic validation

    if (opportunityId) {
      updateOpportunity(opportunityId, formData)
    } else {
      addOpportunity(formData as Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>)
    }
    onClose()
  }

  const toggleActivity = (activity: string) => {
    const current = formData.completedActivities || []
    if (current.includes(activity)) {
      setFormData({ ...formData, completedActivities: current.filter((a) => a !== activity) })
    } else {
      setFormData({ ...formData, completedActivities: [...current, activity] })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pr-8">
            <DialogTitle>{opportunityId ? 'Editar Oportunidade' : 'Nova Oportunidade'}</DialogTitle>
            {stageInfo && (
              <Badge style={{ backgroundColor: stageInfo.hexColor }} className="text-white">
                {stageInfo.label} ({stageInfo.winPercentage}%)
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2 col-span-2 md:col-span-1">
            <Label>Instituição / Cliente</Label>
            <Input
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              placeholder="Ex: Hospital das Clínicas"
            />
          </div>
          <div className="space-y-2 col-span-2 md:col-span-1">
            <Label>Produto</Label>
            <Select
              value={formData.productId}
              onValueChange={(v) => setFormData({ ...formData, productId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Potencial Estimado (R$)</Label>
            <Input
              type="number"
              value={formData.potentialValue || ''}
              onChange={(e) => setFormData({ ...formData, potentialValue: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Previsão de Implementação (Mês/Ano)</Label>
            <Input
              type="month"
              value={formData.estimatedDate}
              onChange={(e) => setFormData({ ...formData, estimatedDate: e.target.value })}
            />
          </div>

          <div className="space-y-4 col-span-2 bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex justify-between items-center">
              <Label>Probabilidade Qualitativa (Seu feeling)</Label>
              <span className="font-bold text-primary">{formData.qualitativeWin}%</span>
            </div>
            <Slider
              value={[formData.qualitativeWin || 0]}
              onValueChange={(v) => setFormData({ ...formData, qualitativeWin: v[0] })}
              max={100}
              step={5}
            />
            <div className="flex justify-between text-sm text-slate-500 pt-2 border-t border-slate-200">
              <span>
                Sistema (Fase): <b>{stageInfo?.winPercentage}%</b>
              </span>
              <span>
                Prob. Final Calculada: <b className="text-slate-800">{finalWin}%</b>
              </span>
            </div>
          </div>

          <div className="col-span-2 space-y-3 pt-2">
            <Label className="text-base text-primary font-semibold border-b pb-1 border-slate-100 flex w-full">
              Atividades Chave - Fase: {stageInfo?.label}
            </Label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {checklist.map((activity, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <Checkbox
                    id={`act-${idx}`}
                    checked={(formData.completedActivities || []).includes(activity)}
                    onCheckedChange={() => toggleActivity(activity)}
                  />
                  <label
                    htmlFor={`act-${idx}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-slate-700"
                  >
                    {activity}
                  </label>
                </div>
              ))}
              {checklist.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nenhuma atividade mapeada para esta fase.
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar Oportunidade</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
