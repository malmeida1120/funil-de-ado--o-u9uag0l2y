import { Opportunity, Product } from '@/types'
import { STAGES, STAGE_ORDER } from '@/lib/constants'

export function downloadCsv(filename: string, csvContent: string) {
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportForecastMatrix(
  matrix: Record<string, Record<string, number>>,
  uniqueMonths: string[],
  formatMonth: (m: string) => string,
) {
  const headers = ['Fase', 'Probabilidade', ...uniqueMonths.map(formatMonth), 'Total Geral']
  const rows = [headers.join(';')]

  STAGE_ORDER.forEach((stageId) => {
    const stage = STAGES[stageId]
    const rowTotal = uniqueMonths.reduce((sum, month) => sum + (matrix[stageId][month] || 0), 0)

    const row = [
      stage.label,
      `${stage.winPercentage}%`,
      ...uniqueMonths.map((month) => (matrix[stageId][month] || 0).toString().replace('.', ',')),
      rowTotal.toString().replace('.', ','),
    ]
    rows.push(row.join(';'))
  })

  downloadCsv('forecast_matrix.csv', rows.join('\n'))
}

export function exportOpportunities(opportunities: Opportunity[], products: Product[]) {
  const headers = [
    'Instituição/Cliente',
    'Produto',
    'Fase do Funil',
    'Prob. Qualitativa (%)',
    'Prob. Quantitativa (%)',
    'Valor Total (R$)',
    'Data de Implementação',
  ]
  const rows = [headers.join(';')]

  opportunities.forEach((opp) => {
    const product = products.find((p) => p.id === opp.productId)?.name || 'Sem Produto'
    const stage = STAGES[opp.stageId]
    const row = [
      `"${opp.clientName.replace(/"/g, '""')}"`,
      `"${product.replace(/"/g, '""')}"`,
      stage.label,
      opp.qualitativeWin.toString(),
      stage.winPercentage.toString(),
      opp.potentialValue.toString().replace('.', ','),
      opp.estimatedDate || 'Sem Data',
    ]
    rows.push(row.join(';'))
  })

  downloadCsv('opportunities.csv', rows.join('\n'))
}
