import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  KanbanSquare,
  Package,
  Settings,
  Search,
  Plus,
  LogOut,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/use-auth'

const menuItems = [
  { title: 'Dashboard Executivo', url: '/', icon: LayoutDashboard },
  { title: 'Oportunidades', url: '/opportunities', icon: KanbanSquare },
  { title: 'Produtos', url: '/products', icon: Package },
  { title: 'Configurações', url: '/settings', icon: Settings },
]

export default function SidebarLayout() {
  const location = useLocation()
  const { signOut, user } = useAuth()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50">
        <Sidebar className="border-r border-slate-200 bg-white">
          <SidebarHeader className="p-4 border-b border-slate-100 flex items-center justify-center">
            <div className="text-primary font-bold text-2xl tracking-tight flex items-center gap-2">
              <span className="bg-primary text-white p-1 rounded-sm text-sm">F</span>
              FERRING
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs uppercase tracking-wider text-slate-500">
                Menu Principal
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.url}
                        className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                      >
                        <Link to={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <div className="mt-auto p-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{user?.email?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium leading-none truncate">
                  {user?.email?.split('@')[0]}
                </span>
                <span className="text-xs text-muted-foreground mt-1 truncate">
                  Acesso ao Mercado
                </span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={signOut} title="Sair">
              <LogOut className="h-4 w-4 text-slate-500" />
            </Button>
          </div>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
          <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 sm:px-6 shrink-0 gap-2">
            <div className="flex items-center gap-3 flex-1 overflow-hidden">
              <SidebarTrigger className="md:hidden shrink-0" />
              <h1 className="text-lg sm:text-xl font-semibold text-slate-800 truncate">
                {menuItems.find((m) => m.url === location.pathname)?.title || 'Market Access'}
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 justify-end shrink-0">
              <div className="relative w-48 sm:w-64 hidden sm:block">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar oportunidade..."
                  className="pl-9 bg-slate-50 border-slate-200 h-9"
                />
              </div>
              <Button asChild size="sm">
                <Link to="/opportunities?new=true">
                  <Plus className="sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Nova Oportunidade</span>
                </Link>
              </Button>
            </div>
          </header>
          <div className="flex-1 overflow-auto p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
