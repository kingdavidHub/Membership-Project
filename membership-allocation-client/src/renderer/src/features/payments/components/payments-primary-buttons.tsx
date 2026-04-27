import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

type PaymentsPrimaryButtonsProps = {
  onClick: () => void
}

export function PaymentsPrimaryButtons({ onClick }: PaymentsPrimaryButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button type="button" className="space-x-1" onClick={onClick}>
        <span>Add Payment</span> <Plus size={18} />
      </Button>
    </div>
  )
}
