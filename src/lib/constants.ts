import { Stage, StageId } from '@/types'

export const STAGES: Record<StageId, Stage> = {
  LEAD: {
    id: 'LEAD',
    label: 'Lead',
    winPercentage: 10,
    colorClass: 'bg-funnel-lead',
    hexColor: '#990033',
  },
  QUALIFICAR: {
    id: 'QUALIFICAR',
    label: 'Qualificar',
    winPercentage: 25,
    colorClass: 'bg-funnel-qualificar',
    hexColor: '#006666',
  },
  DESENVOLVER: {
    id: 'DESENVOLVER',
    label: 'Desenvolver',
    winPercentage: 50,
    colorClass: 'bg-funnel-desenvolver',
    hexColor: '#E67E22',
  },
  AVALIAR: {
    id: 'AVALIAR',
    label: 'Avaliar',
    winPercentage: 75,
    colorClass: 'bg-funnel-avaliar',
    hexColor: '#2980B9',
  },
  IMPLEMENTAR: {
    id: 'IMPLEMENTAR',
    label: 'Implementar',
    winPercentage: 100,
    colorClass: 'bg-funnel-implementar',
    hexColor: '#00AEEF',
  },
}

export const STAGE_ORDER: StageId[] = [
  'LEAD',
  'QUALIFICAR',
  'DESENVOLVER',
  'AVALIAR',
  'IMPLEMENTAR',
]

export const STAGE_CHECKLISTS: Record<StageId, string[]> = {
  LEAD: [
    'Registrar lead no CRM com dados mínimos',
    'Identificar origem e validar necessidade potencial',
    'Enriquecer dados básicos da instituição (tipo, porte, comitês, histórico)',
  ],
  QUALIFICAR: [
    'Mapear stakeholders principais (técnicos e econômicos)',
    'Estimar potencial de volume com base em casuística e capacidade instalada',
    'Identificar etapas e critérios do processo decisório',
    'Levantar barreiras (técnicas, comerciais, logísticas, concorrência)',
    'Definir estratégia e próximos passos no plano de conta',
  ],
  DESENVOLVER: [
    'Realizar reuniões clínicas focadas nos benefícios e desfechos relevantes',
    'Demonstrar evidências essenciais de eficácia, segurança e aplicabilidade',
    'Adaptar mensagens e argumentos ao protocolo e realidade clínica da instituição',
    'Tratar dúvidas e objeções técnicas dos decisores clínicos',
  ],
  AVALIAR: [
    'Protocolar a submissão conforme checklist e requisitos formais da instituição',
    'Disponibilizar evidências econômicas: custo-efetividade, budget impact e alternativas comparativas',
    'Atender solicitações do comitê (Q&A, complementações técnicas/econômicas)',
    'Acompanhar reuniões que avaliam valor terapêutico x custo',
  ],
  IMPLEMENTAR: [
    'Executar cadastro e padronização nos sistemas internos da instituição',
    'Coordenar condições de supply, entrega e armazenamento',
    'Treinar equipes clínicas e operacionais',
    'Monitorar adoção (30/60/90 dias), consumo e adesão a protocolo',
  ],
}
