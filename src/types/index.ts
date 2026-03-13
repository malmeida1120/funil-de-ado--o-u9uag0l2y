export type StageId = 'LEAD' | 'QUALIFICAR' | 'DESENVOLVER' | 'AVALIAR' | 'IMPLEMENTAR'

export interface Stage {
  id: StageId
  label: string
  winPercentage: number
  colorClass: string
  hexColor: string
}

export interface Product {
  id: string
  name: string
  therapeuticLine: string
}

export interface Opportunity {
  id: string
  clientName: string
  productId: string
  stageId: StageId
  potentialValue: number
  estimatedDate: string // YYYY-MM
  qualitativeWin: number // 0-100
  completedActivities: string[] // Array of activity IDs/strings
  status?: 'ACTIVE' | 'WON' | 'LOST'
  createdAt: string
  updatedAt: string
}

export interface DashboardMetrics {
  totalPipelineValue: number
  weightedRevenue: number
  averageCycleTimeDays: number
  conversionRate: number
}
