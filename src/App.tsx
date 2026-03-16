import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import Opportunities from './pages/Opportunities'
import Products from './pages/Products'
import AccessManagement from './pages/AccessManagement'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import SidebarLayout from './components/SidebarLayout'
import { MainProvider } from './stores/main'
import { AuthProvider, useAuth } from './hooks/use-auth'
import { Button } from '@/components/ui/button'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading, signOut } = useAuth()

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">Carregando...</div>
    )

  if (!user) return <Navigate to="/login" replace />

  if (profile && !profile.is_approved) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Acesso Restrito</h2>
          <p className="text-slate-500 max-w-md">
            Seu cadastro está aguardando aprovação do administrador. Você receberá acesso assim que
            seu perfil for verificado.
          </p>
        </div>
        <Button variant="outline" onClick={signOut}>
          Sair da Conta
        </Button>
      </div>
    )
  }

  return <>{children}</>
}

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <AuthProvider>
      <MainProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              element={
                <ProtectedRoute>
                  <SidebarLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Index />} />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route path="/products" element={<Products />} />
              <Route path="/access-management" element={<AccessManagement />} />
              <Route
                path="/settings"
                element={<div className="p-8 text-muted-foreground">Configurações em breve.</div>}
              />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </MainProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
