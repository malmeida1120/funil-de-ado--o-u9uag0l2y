import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Opportunity, Product, StageId } from '@/types'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

interface MainState {
  opportunities: Opportunity[]
  products: Product[]
  addOpportunity: (opp: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void
  moveOpportunity: (id: string, newStage: StageId) => boolean
  deleteOpportunity: (id: string) => Promise<{ error: any }>
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
}

const MainContext = createContext<MainState | undefined>(undefined)

const mapOpp = (d: any, profiles: any[]): Opportunity => {
  const creator = profiles.find((p) => p.id === d.user_id)
  const updater = profiles.find((p) => p.id === (d.last_updated_by || d.user_id))

  return {
    id: d.id,
    title: d.title || 'Sem Título',
    description: d.description || '',
    productId: d.product_id,
    stageId: d.stage_id,
    potentialValue: Number(d.potential_value) || 0,
    estimatedDate: d.estimated_date || '',
    qualitativeWin: Number(d.qualitative_win) || 0,
    completedActivities: Array.isArray(d.completed_activities) ? d.completed_activities : [],
    status: d.status || 'ACTIVE',
    createdAt: d.created_at,
    updatedAt: d.updated_at,
    userId: d.user_id,
    lastUpdatedBy: d.last_updated_by || d.user_id,
    creatorEmail: creator?.email || 'Desconhecido',
    updaterEmail: updater?.email || 'Desconhecido',
  }
}

const unmapOpp = (o: Partial<Opportunity>, uid: string) => {
  const d: any = {}
  if (o.title !== undefined) d.title = o.title
  if (o.description !== undefined) d.description = o.description
  if (o.productId !== undefined) d.product_id = o.productId
  if (o.stageId !== undefined) d.stage_id = o.stageId
  if (o.potentialValue !== undefined) d.potential_value = o.potentialValue
  if (o.estimatedDate !== undefined) d.estimated_date = o.estimatedDate
  if (o.qualitativeWin !== undefined) d.qualitative_win = o.qualitativeWin
  if (o.completedActivities !== undefined)
    d.completed_activities = Array.isArray(o.completedActivities) ? o.completedActivities : []
  if (o.status !== undefined) d.status = o.status
  return d
}

export function MainProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [profiles, setProfiles] = useState<any[]>([])

  useEffect(() => {
    if (!user) {
      setOpportunities([])
      setProducts([])
      setProfiles([])
      return
    }

    const fetchData = async () => {
      const [prodsRes, oppsRes, profilesRes] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('opportunities').select('*'),
        supabase.from('profiles' as any).select('*'),
      ])

      const currentProfiles = profilesRes.data || []
      setProfiles(currentProfiles)

      if (prodsRes.data) {
        setProducts(
          prodsRes.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            therapeuticLine: p.therapeutic_line,
          })),
        )
      }
      if (oppsRes.data) setOpportunities(oppsRes.data.map((o) => mapOpp(o, currentProfiles)))
    }
    fetchData()
  }, [user])

  const addOpportunity = async (opp: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return
    const dbData = unmapOpp(opp, user.id)
    dbData.user_id = user.id
    dbData.last_updated_by = user.id
    dbData.status = opp.status || 'ACTIVE'

    const { data } = await supabase.from('opportunities').insert(dbData).select().single()
    if (data) {
      const mapped = mapOpp(data, profiles)
      mapped.creatorEmail = user.email || mapped.creatorEmail
      mapped.updaterEmail = user.email || mapped.updaterEmail
      setOpportunities((prev) => [...prev, mapped])
    }
  }

  const updateOpportunity = async (id: string, updates: Partial<Opportunity>) => {
    if (!user) return
    const dbData = unmapOpp(updates, user.id)
    dbData.last_updated_by = user.id

    setOpportunities((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              ...updates,
              updatedAt: new Date().toISOString(),
              updaterEmail: user.email || o.updaterEmail,
              lastUpdatedBy: user.id,
            }
          : o,
      ),
    )

    const { data } = await supabase
      .from('opportunities')
      .update(dbData)
      .eq('id', id)
      .select()
      .single()

    if (data) {
      setOpportunities((prev) => prev.map((o) => (o.id === id ? mapOpp(data, profiles) : o)))
    }
  }

  const moveOpportunity = (id: string, newStage: StageId) => {
    updateOpportunity(id, { stageId: newStage })
    return true
  }

  const deleteOpportunity = async (id: string) => {
    if (!user) return { error: 'Not authenticated' }
    const previous = [...opportunities]
    setOpportunities((prev) => prev.filter((o) => o.id !== id))
    const { error } = await supabase.from('opportunities').delete().eq('id', id)
    if (error) setOpportunities(previous)
    return { error }
  }

  const addProduct = async (product: Omit<Product, 'id'>) => {
    if (!user) return
    const { data } = await supabase
      .from('products')
      .insert({
        name: product.name,
        therapeutic_line: product.therapeuticLine,
        user_id: user.id,
      })
      .select()
      .single()
    if (data)
      setProducts((prev) => [
        ...prev,
        { id: data.id, name: data.name, therapeuticLine: data.therapeutic_line },
      ])
  }

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    if (!user) return
    const payload: any = {}
    if (updates.name) payload.name = updates.name
    if (updates.therapeuticLine) payload.therapeutic_line = updates.therapeuticLine

    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
    await supabase.from('products').update(payload).eq('id', id)
  }

  const deleteProduct = async (id: string) => {
    if (!user) return
    setProducts((prev) => prev.filter((p) => p.id !== id))
    await supabase.from('products').delete().eq('id', id)
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
        deleteOpportunity,
        addProduct,
        updateProduct,
        deleteProduct,
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
