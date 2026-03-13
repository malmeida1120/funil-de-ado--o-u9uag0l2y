import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import Opportunities from './pages/Opportunities'
import Products from './pages/Products'
import NotFound from './pages/NotFound'
import SidebarLayout from './components/SidebarLayout'
import { MainProvider } from './stores/main'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <MainProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<SidebarLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/products" element={<Products />} />
            {/* Settings route can be a placeholder for now */}
            <Route
              path="/settings"
              element={<div className="p-8 text-muted-foreground">Configurações em breve.</div>}
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </MainProvider>
  </BrowserRouter>
)

export default App
