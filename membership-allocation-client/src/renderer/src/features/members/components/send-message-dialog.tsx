'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { reportsService } from '@/api/services'
import { type Member } from '../data/schema'
import { useMembers } from './members-provider'

const formSchema = z.object({
  subject: z.string().min(1, 'Subject is required.'),
  body: z.string().min(1, 'Message body is required.')
})

type SendMessageForm = z.infer<typeof formSchema>

type SendMessageDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedMembers: Member[]
}

export function SendMessageDialog({ open, onOpenChange, selectedMembers }: SendMessageDialogProps) {
  const { requestSelectionReset } = useMembers()
  const form = useForm<SendMessageForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: '',
      body: ''
    }
  })

  const sendMutation = useMutation({
    mutationFn: (data: SendMessageForm) =>
      reportsService.sendMembersMessage({
        subject: data.subject,
        body: data.body,
        memberIds: selectedMembers.map((m) => m._id)
      }),
    onSuccess: () => {
      toast.success('Message sent successfully.')
      form.reset()
      onOpenChange(false)
      requestSelectionReset()
    },
    onError: () => {
      toast.error('Failed to send message. Please try again.')
    }
  })

  const onSubmit = (values: SendMessageForm) => {
    sendMutation.mutate(values)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-start">
          <DialogTitle>Send Message</DialogTitle>
          <DialogDescription>
            Send a message to {selectedMembers.length} selected member
            {selectedMembers.length > 1 ? 's' : ''}.
          </DialogDescription>
        </DialogHeader>

        {/* Selected members display */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Recipients</p>
          <div className="flex flex-wrap gap-2">
            {selectedMembers.map((member) => (
              <Badge key={member._id} variant="secondary" className="gap-1 py-1">
                {member.firstName} {member.lastName}
              </Badge>
            ))}
          </div>
        </div>

        <Form {...form}>
          <form id="send-message-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter message subject" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your message here..."
                      className="min-h-40 resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="send-message-form" disabled={sendMutation.isPending}>
            {sendMutation.isPending ? 'Sending...' : 'Send Message'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
