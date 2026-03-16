import { useState } from 'react'
import { useMainStore } from '@/stores/main'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Product } from '@/types'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useMainStore()
  const { profile } = useAuth()
  const isViewer = profile?.role === 'viewer'

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({ name: '', therapeuticLine: '' })

  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleOpenAdd = () => {
    setEditingProduct(null)
    setFormData({ name: '', therapeuticLine: '' })
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({ name: product.name, therapeuticLine: product.therapeuticLine })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (formData.name && formData.therapeuticLine) {
      if (editingProduct) {
        updateProduct(editingProduct.id, formData)
      } else {
        addProduct(formData)
      }
      setIsDialogOpen(false)
    }
  }

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteProduct(deleteId)
      setDeleteId(null)
    }
  }

  return (
    <div className="max-w-4xl animate-fade-in pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-slate-800">Catálogo de Produtos</h2>
        {!isViewer && (
          <Button onClick={handleOpenAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Produto
          </Button>
        )}
      </div>

      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Nome do Produto</TableHead>
              <TableHead>Linha Terapêutica</TableHead>
              {!isViewer && <TableHead className="w-[120px] text-right">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.therapeuticLine}</TableCell>
                {!isViewer && (
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-slate-900"
                        onClick={() => handleOpenEdit(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setDeleteId(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={isViewer ? 2 : 3}
                  className="text-center py-12 text-muted-foreground"
                >
                  Nenhum produto cadastrado no portfólio.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome do Produto</Label>
              <Input
                placeholder="Ex: Novo Medicamento"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Linha Terapêutica</Label>
              <Input
                placeholder="Ex: Oncologia"
                value={formData.therapeuticLine}
                onChange={(e) => setFormData({ ...formData, therapeuticLine: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o produto do seu
              catálogo. As oportunidades vinculadas a este produto ficarão sem produto atribuído.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir Produto
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
