import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDependents } from './dependents-provider'

export function DependentsPrimaryButtons() {
  const { setOpen } = useDependents()

  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen('add')}>
        <span>Add Dependent</span> <Plus size={18} />
      </Button>
    </div>
  )
}
