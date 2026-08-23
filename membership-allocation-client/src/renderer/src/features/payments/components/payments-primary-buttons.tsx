import { Plus, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

type PaymentsPrimaryButtonsProps = {
  onClick: () => void
  onSettingsClick: () => void
}

export function PaymentsPrimaryButtons({ onClick, onSettingsClick }: PaymentsPrimaryButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button type="button" variant="outline" className="space-x-1" onClick={onSettingsClick}>
        <Settings size={18} /> <span>Default Payment</span>
      </Button>
      <Button type="button" className="space-x-1" onClick={onClick}>
        <span>Add Payment</span> <Plus size={18} />
      </Button>
    </div>
  )
}
