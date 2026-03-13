import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMainStore } from '@/stores/main'
import FunnelChart from '@/components/dashboard/FunnelChart'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { STAGES } from '@/lib/constants'

export default function Index() {
  const { opportunities, products } = useMainStore()
  const [selectedProductId, setSelectedProductId] = useState<string>('ALL')

  const filteredOpportunities = useMemo(() => {
    if (selectedProductId === 'ALL') return opportunities
    return opportunities.filter((opp) => opp.productId === selectedProductId)
  }, [opportunities, selectedProductId])

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

  const chartData = useMemo(() => {
    // Group weighted revenue by estimated Date
    const grouped = filteredOpportunities.reduce(
      (acc, opp) => {
        const date = opp.estimatedDate || 'S/D'
        if (!acc[date]) acc[date] = 0
        const stageWin = STAGES[opp.stageId].winPercentage
        const finalWin = (opp.qualitativeWin + stageWin) / 2
        acc[date] += opp.potentialValue * (finalWin / 100)
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(grouped)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 12) // Show max 12 periods
  }, [filteredOpportunities])

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val)

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard Executivo</h2>
        </div>
        <div className="w-full sm:w-64">
          <Select value={selectedProductId} onValueChange={setSelectedProductId}>
            <SelectTrigger>
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Funil de Adoção Institucional</CardTitle>
            <CardDescription>Volume e valor das oportunidades por etapa</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center">
            <FunnelChart opportunities={filteredOpportunities} />
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Forecast de Faturamento</CardTitle>
            <CardDescription>Receita ponderada projetada por data de implementação</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    tickFormatter={(val) => `R$ ${val / 1000}k`}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    cursor={{ fill: '#f3f4f6' }}
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Bar dataKey="value" fill="#0076B6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Sem dados suficientes
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
