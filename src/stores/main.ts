import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Opportunity, Product, StageId } from '@/types'

interface MainState {
  opportunities: Opportunity[]
  products: Product[]
  addOpportunity: (opp: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void
  moveOpportunity: (id: string, newStage: StageId) => boolean
  addProduct: (product: Omit<Product, 'id'>) => void
}

const mockProducts: Product[] = [
  { id: 'p1', name: 'Zomacton', therapeuticLine: 'Gastroenterologia' },
  { id: 'p2', name: 'Firmagon', therapeuticLine: 'Endocrinologia' },
  { id: 'p3', name: 'Tractocile', therapeuticLine: 'Saúde Materna' },
]

const mockOpportunities: Opportunity[] = [
  {
    id: 'o1',
    clientName: 'Hospital Sírio-Libanês',
    productId: 'p1',
    stageId: 'QUALIFICAR',
    potentialValue: 150000,
    estimatedDate: '2026-08',
    qualitativeWin: 40,
    completedActivities: [
      'Registrar lead no CRM com dados mínimos',
      'Identificar origem e validar necessidade potencial',
      'Enriquecer dados básicos da instituição (tipo, porte, comitês, histórico)',
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'o2',
    clientName: 'Albert Einstein',
    productId: 'p3',
    stageId: 'AVALIAR',
    potentialValue: 300000,
    estimatedDate: '2026-05',
    qualitativeWin: 80,
    completedActivities: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'o3',
    clientName: "Rede D'Or",
    productId: 'p2',
    stageId: 'LEAD',
    potentialValue: 50000,
    estimatedDate: '2026-11',
    qualitativeWin: 20,
    completedActivities: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const MainContext = createContext<MainState | undefined>(undefined)

export function MainProvider({ children }: { children: ReactNode }) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities)
  const [products, setProducts] = useState<Product[]>(mockProducts)

  const addOpportunity = (opp: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOpp: Opportunity = {
      ...opp,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setOpportunities((prev) => [...prev, newOpp])
  }

  const updateOpportunity = (id: string, updates: Partial<Opportunity>) => {
    setOpportunities((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o,
      ),
    )
  }

  const moveOpportunity = (id: string, newStage: StageId) => {
    // Basic validation handled by UI mostly, but we can enforce it here if needed
    updateOpportunity(id, { stageId: newStage })
    return true
  }

  const addProduct = (product: Omit<Product, 'id'>) => {
    setProducts((prev) => [...prev, { ...product, id: Math.random().toString(36).substr(2, 9) }])
  }

  return React.createElement(
    MainContext.Provider,
    {
      value: {
        opportunities,
        products,
        addOpportunity,
        updateOpportunity,
        moveOpportunity,
        addProduct,
      },
    },
    children,
  )
}

export function useMainStore() {
  const context = useContext(MainContext)
  if (!context) throw new Error('useMainStore must be used within MainProvider')
  return context
}
