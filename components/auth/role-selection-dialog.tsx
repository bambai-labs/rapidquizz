'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUserProfile } from '@/hooks/use-user-profile'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const roleSchema = z
  .object({
    userRole: z.enum(['student', 'teacher', 'other'], {
      message: 'Please select your role',
    }),
    customRole: z.string().optional(),
  })
  .refine((data) => data.userRole !== 'other' || (data.customRole && data.customRole.trim().length > 0), {
    message: 'Please specify your role',
    path: ['customRole'],
  })

type RoleFormData = z.infer<typeof roleSchema>

interface RoleSelectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const RoleSelectionDialog = ({ open, onOpenChange }: RoleSelectionDialogProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const { updateUserRole } = useUserProfile()

  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      userRole: undefined,
      customRole: '',
    },
  })

  const onSubmit = async (data: RoleFormData) => {
    setIsLoading(true)
    try {
      const result = await updateUserRole(data.userRole, data.customRole)
      
      if (result.success) {
        toast.success('Profile updated successfully!')
        onOpenChange(false)
        form.reset()
      } else {
        toast.error(result.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating role:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            To personalize your experience, please tell us what type of person you are.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="userRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What type of person are you?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AnimatePresence>
              {form.watch('userRole') === 'other' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FormField
                    control={form.control}
                    name="customRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Please specify your role</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="e.g., Parent, Tutor, Administrator"
                            {...field}
                            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-end space-x-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center space-x-2"
                    >
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </motion.div>
                  ) : (
                    <motion.span
                      key="text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Save Profile
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
