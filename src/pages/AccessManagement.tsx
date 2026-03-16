import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

interface Profile {
  id: string
  email: string
  role: string
  is_approved: boolean
}

export default function AccessManagement() {
  const { profile } = useAuth()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchProfiles = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('profiles').select('*').order('email')
    if (data) setProfiles(data)
    setLoading(false)
  }

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchProfiles()
    }
  }, [profile])

  if (profile?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  const handleApprove = async (id: string) => {
    const { error } = await supabase.from('profiles').update({ is_approved: true }).eq('id', id)
    if (!error) {
      toast({ title: 'Usuário aprovado com sucesso!' })
      fetchProfiles()
    } else {
      toast({ title: 'Erro ao aprovar usuário', variant: 'destructive' })
    }
  }

  const handleRoleChange = async (id: string, role: string) => {
    const { error } = await supabase.from('profiles').update({ role }).eq('id', id)
    if (!error) {
      toast({ title: 'Permissão atualizada!' })
      fetchProfiles()
    } else {
      toast({ title: 'Erro ao atualizar permissão', variant: 'destructive' })
    }
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">Gestão de Acessos</h2>
        <p className="text-slate-500 mt-1">
          Gerencie os usuários e suas permissões de acesso ao funil.
        </p>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Nível de Acesso</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : (
              profiles.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.email}</TableCell>
                  <TableCell>
                    {p.is_approved ? (
                      <Badge className="bg-green-500 hover:bg-green-600">Aprovado</Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-amber-100 text-amber-800 hover:bg-amber-200"
                      >
                        Pendente
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Select
                      disabled={!p.is_approved}
                      value={p.role}
                      onValueChange={(val) => handleRoleChange(p.id, val)}
                    >
                      <SelectTrigger className="w-[180px] h-8 text-xs bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">Visualizar somente</SelectItem>
                        <SelectItem value="editor">Editar</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    {!p.is_approved && (
                      <Button size="sm" onClick={() => handleApprove(p.id)}>
                        Aprovar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
            {!loading && profiles.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
