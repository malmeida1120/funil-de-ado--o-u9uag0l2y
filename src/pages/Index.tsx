import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useMainStore } from '@/stores/main'
import FunnelChart from '@/components/dashboard/FunnelChart'
import { STAGES, STAGE_ORDER } from '@/lib/constants'
import { ClientFilter } from '@/components/shared/ClientFilter'
import { exportForecastMatrix } from '@/lib/export'

export default function Index() {
  const { opportunities, products } = useMainStore()
  const [selectedProductId, setSelectedProductId] = useState<string>('ALL')
  const [selectedClients, setSelectedClients] = useState<string[]>([])

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

  const metrics = useMemo(() => {
    let totalValue = 0
    let weightedRev = 0

    filteredOpportunities.forEach((opp) => {
      totalValue += opp.potentialValue
      const stageWin = STAGES[opp.stageId].winPercentage
      const finalWin = (opp.qualitativeWin + stageWin) / 2
      weightedRev += opp.potentialValue * (finalWin / 100)
    })

    const implemented = filteredOpportunities.filter((o) => o.stageId === 'IMPLEMENTAR').length
    const conversionRate =
      filteredOpportunities.length > 0 ? (implemented / filteredOpportunities.length) * 100 : 0

    return {
      totalValue,
      weightedRev,
      conversionRate,
    }
  }, [filteredOpportunities])

  const uniqueMonths = useMemo(() => {
    const months = new Set<string>()
    filteredOpportunities.forEach((opp) => {
      months.add(opp.estimatedDate || 'S/D')
    })
    return Array.from(months).sort((a, b) => {
      if (a === 'S/D') return 1
      if (b === 'S/D') return -1
      return a.localeCompare(b)
    })
  }, [filteredOpportunities])

  const forecastMatrix = useMemo(() => {
    const matrix: Record<string, Record<string, number>> = {}
    STAGE_ORDER.forEach((stageId) => {
      matrix[stageId] = {}
      uniqueMonths.forEach((month) => {
        matrix[stageId][month] = 0
      })
    })

    filteredOpportunities.forEach((opp) => {
      const month = opp.estimatedDate || 'S/D'
      if (matrix[opp.stageId] && matrix[opp.stageId][month] !== undefined) {
        matrix[opp.stageId][month] += opp.potentialValue
      } else if (matrix[opp.stageId]) {
        matrix[opp.stageId][month] = opp.potentialValue
      }
    })
    return matrix
  }, [filteredOpportunities, uniqueMonths])

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val)

  const formatMonth = (val: string) => {
    if (val === 'S/D') return 'Sem Data'
    const [year, month] = val.split('-')
    if (!year || !month) return val
    const date = new Date(parseInt(year), parseInt(month) - 1)
    let formatted = new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' }).format(
      date,
    )
    return formatted.charAt(0).toUpperCase() + formatted.slice(1)
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard Executivo</h2>
        </div>
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
            onClick={() => exportForecastMatrix(forecastMatrix, uniqueMonths, formatMonth)}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pipeline Total Bruto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalValue)}</div>
            <p className="text-xs text-muted-foreground">Valor total de todas oportunidades</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-primary">
              Receita Ponderada (Forecast)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(metrics.weightedRev)}
            </div>
            <p className="text-xs text-muted-foreground">
              Baseado na probabilidade Média (Quali + Sistêmica)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Taxa de Conversão Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Leads convertidos em Implementação</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Funil de Adoção Institucional</CardTitle>
            <CardDescription>Volume e valor bruto das oportunidades por etapa</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[350px] flex items-center justify-center pt-0">
            <FunnelChart opportunities={filteredOpportunities} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Matriz de Forecast de Faturamento</CardTitle>
            <CardDescription>
              Valor total bruto projetado por data de implementação e fase do funil
            </CardDescription>
          </CardHeader>
          <CardContent>
            {uniqueMonths.length > 0 ? (
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px] bg-slate-50/50">
                        Fase (Probabilidade)
                      </TableHead>
                      {uniqueMonths.map((month) => (
                        <TableHead
                          key={month}
                          className="text-right whitespace-nowrap bg-slate-50/50"
                        >
                          {formatMonth(month)}
                        </TableHead>
                      ))}
                      <TableHead className="text-right font-bold whitespace-nowrap bg-slate-50/50">
                        Total Geral
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {STAGE_ORDER.map((stageId) => {
                      const stage = STAGES[stageId]
                      const rowTotal = uniqueMonths.reduce(
                        (sum, month) => sum + (forecastMatrix[stageId][month] || 0),
                        0,
                      )
                      return (
                        <TableRow key={stageId}>
                          <TableCell className="font-medium whitespace-nowrap border-r bg-slate-50/30">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: stage.hexColor }}
                              />
                              {stage.label} ({stage.winPercentage}%)
                            </div>
                          </TableCell>
                          {uniqueMonths.map((month) => {
                            const val = forecastMatrix[stageId][month] || 0
                            return (
                              <TableCell key={month} className="text-right whitespace-nowrap">
                                {val > 0 ? formatCurrency(val) : '-'}
                              </TableCell>
                            )
                          })}
                          <TableCell className="text-right font-bold whitespace-nowrap bg-slate-50/30">
                            {formatCurrency(rowTotal)}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-muted-foreground border border-dashed rounded-lg">
                Sem dados suficientes para gerar a matriz
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
