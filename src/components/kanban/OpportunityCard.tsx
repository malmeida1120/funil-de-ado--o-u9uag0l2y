import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Clock, Trash2 } from 'lucide-react'
import { Opportunity, Product } from '@/types'
import { STAGES, STAGE_CHECKLISTS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useMainStore } from '@/stores/main'
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface OpportunityCardProps {
  opp: Opportunity
  product?: Product
  onClick: () => void
  onDragStart: (e: React.DragEvent, oppId: string) => void
}

export function OpportunityCard({ opp, product, onClick, onDragStart }: OpportunityCardProps) {
  const { deleteOpportunity } = useMainStore()
  const { toast } = useToast()

  const stage = STAGES[opp.stageId]
  const requiredActs = STAGE_CHECKLISTS[opp.stageId] || []
  const completedActs = (opp.completedActivities || []).filter((a) => requiredActs.includes(a))
  const progress = requiredActs.length ? (completedActs.length / requiredActs.length) * 100 : 100
  const finalWin = Math.round(((opp.qualitativeWin || 0) + stage.winPercentage) / 2)

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val)

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const { error } = await deleteOpportunity(opp.id)
    if (error) {
      toast({
        title: 'Failed to delete opportunity. Please try again.',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Opportunity deleted successfully',
      })
    }
  }

  return (
    <Card
      className={cn(
        'cursor-pointer hover:shadow-md transition-shadow active:cursor-grabbing border-slate-200',
        opp.status === 'WON' && 'border-green-500 bg-green-50/50',
        opp.status === 'LOST' && 'border-red-500 bg-red-50/50',
      )}
      draggable
      onDragStart={(e) => onDragStart(e, opp.id)}
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start gap-2">
          <span className="font-semibold text-slate-900 leading-tight">{opp.title}</span>
          <div className="flex items-center gap-1 shrink-0">
            {opp.status === 'WON' && (
              <Badge className="bg-green-500 hover:bg-green-600 shrink-0 text-[10px] px-1.5 py-0">
                Ganha
              </Badge>
            )}
            {opp.status === 'LOST' && (
              <Badge variant="destructive" className="shrink-0 text-[10px] px-1.5 py-0">
                Perdida
              </Badge>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Opportunity</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this opportunity? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className="text-xs text-slate-500 font-medium px-2 py-1 bg-slate-100 rounded inline-block">
          {product?.name || 'Sem Produto'}
        </div>
        <div className="flex justify-between items-end text-sm">
          <div className="flex flex-col">
            <span className="text-slate-400 text-xs">Potencial</span>
            <span className="font-medium text-slate-700">{formatCurrency(opp.potentialValue)}</span>
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
          <span>Atualizado: {new Date(opp.updatedAt).toLocaleDateString('pt-BR')}</span>
        </div>
      </CardContent>
    </Card>
  )
}
