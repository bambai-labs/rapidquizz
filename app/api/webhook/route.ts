import {
  handleCustomerCreated,
  handleSubscriptionActivated,
  handleSubscriptionCanceled,
  handleSubscriptionPastDue,
  handleSubscriptionPaused,
  handleSubscriptionResumed,
} from '@/lib/paddle-webhook-handlers'
import { Environment, EventName, Paddle } from '@paddle/paddle-node-sdk'
import { NextRequest, NextResponse } from 'next/server'

const paddle = new Paddle(process.env.PADDLE_SECRET_TOKEN!, {
  environment: Environment.sandbox,
})

export async function POST(request: NextRequest) {
  const signature = (request.headers.get('paddle-signature') as string) || ''
  const rawRequestBody = (await request.text()) || ''
  const secretKey = process.env.WEBHOOK_SECRET_KEY || ''

  try {
    if (signature && rawRequestBody) {
      const eventData = await paddle.webhooks.unmarshal(
        rawRequestBody,
        secretKey,
        signature,
      )

      switch (eventData.eventType) {
        case EventName.CustomerCreated:
          const customerResult = await handleCustomerCreated({
            id: eventData.data.id,
            email: eventData.data.email,
          })

          if (!customerResult.success) {
            console.log(
              'failed to handle CustomerCreated',
              customerResult.errorMessage,
            )
          }
          break

        case EventName.CustomerUpdated:
          break

        case EventName.SubscriptionActivated:
          const activatedResult = await handleSubscriptionActivated({
            id: eventData.data.id,
            customerId: eventData.data.customerId,
            currentBillingPeriod:
              eventData.data.currentBillingPeriod || undefined,
            scheduledChange: eventData.data.scheduledChange || undefined,
            items: eventData.data.items as any,
          })

          if (!activatedResult.success) {
            break
          }

          console.log('Someone has activated a subscription')

          break

        case EventName.SubscriptionCanceled:
          const canceledResult = await handleSubscriptionCanceled({
            id: eventData.data.id,
            customerId: eventData.data.customerId,
            canceledAt: eventData.data.canceledAt || new Date().toISOString(),
          })

          if (!canceledResult.success) {
            console.log(
              'failed to handle SubscriptionCanceled',
              canceledResult.errorMessage,
            )
          }

          break

        case EventName.SubscriptionUpdated:
          break

        case EventName.SubscriptionPaused:
          const pausedResult = await handleSubscriptionPaused({
            id: eventData.data.id,
            customerId: eventData.data.customerId,
            pausedAt: eventData.data.pausedAt || new Date().toISOString(),
          })

          if (!pausedResult.success) {
            console.log(
              'failed to handle SubscriptionPaused',
              pausedResult.errorMessage,
            )
          }
          break

        case EventName.SubscriptionResumed:
          const resumedResult = await handleSubscriptionResumed({
            id: eventData.data.id,
            customerId: eventData.data.customerId,
            resumedAt: new Date().toISOString(),
          })

          if (!resumedResult.success) {
            console.log(
              'failed to handle SubscriptionResumed',
              resumedResult.errorMessage,
            )
          }
          break

        case EventName.SubscriptionPastDue:
          const pastDueResult = await handleSubscriptionPastDue({
            id: eventData.data.id,
            customerId: eventData.data.customerId,
            pastDueAt: new Date().toISOString(),
          })

          if (!pastDueResult.success) {
            console.log(
              'failed to handle SubscriptionPastDue',
              pastDueResult.errorMessage,
            )
          }
          break

        default:
          console.log('Unhandled event type', eventData.eventType)
      }
    } else {
      console.log('Signature missing in header')
    }
  } catch (e) {
    console.log(e)
  }

  return NextResponse.json({
    ok: true,
  })
}
