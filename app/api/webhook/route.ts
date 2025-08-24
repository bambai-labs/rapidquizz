import {
  handleCustomerCreated,
  handleSubscriptionActivated,
  handleSubscriptionCanceled,
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
  // req.body should be of type `buffer`, convert to string before passing it to `unmarshal`.
  // If express returned a JSON, remove any other middleware that might have processed raw request to object
  const rawRequestBody = (await request.text()) || ''
  // Replace `WEBHOOK_SECRET_KEY` with the secret key in notifications from vendor dashboard
  const secretKey = process.env.WEBHOOK_SECRET_KEY || ''

  try {
    if (signature && rawRequestBody) {
      // The `unmarshal` function will validate the integrity of the webhook and return an entity
      const eventData = await paddle.webhooks.unmarshal(
        rawRequestBody,
        secretKey,
        signature,
      )

      // database operations
      switch (eventData.eventType) {
        case EventName.CustomerCreated:
          // create customer in database

          const customerResult = await handleCustomerCreated({
            id: eventData.data.id,
            email: eventData.data.email,
          })

          if (!customerResult.success) {
            console.log(
              'Failed to handle CustomerCreated:',
              customerResult.errorMessage,
            )
          }
          console.log(
            `Customer ${eventData.data.id} was created using email ${eventData.data.email}`,
          )
          break

        case EventName.CustomerUpdated:
          // update customer in database
          console.log(
            `Customer ${eventData.data.id} was updated using email ${eventData.data.email}`,
          )
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
            console.error(
              'Failed to handle SubscriptionActivated:',
              activatedResult.errorMessage,
            )
          }

          // activate subscription in database
          console.log(
            `Subscription ${eventData.data.id} was activated for customer ${eventData.data.customerId}`,
          )

          break

        case EventName.SubscriptionCanceled:
          // deactivate subscription in database
          const canceledResult = await handleSubscriptionCanceled({
            id: eventData.data.id,
            customerId: eventData.data.customerId,
            canceledAt: eventData.data.canceledAt || new Date().toISOString(),
          })

          if (!canceledResult.success) {
            console.error(
              'Failed to handle SubscriptionCanceled:',
              canceledResult.errorMessage,
            )
          }

          console.log(
            `Subscription ${eventData.data.id} was canceled for user ${eventData.data.customerId}`,
          )
          break

        case EventName.SubscriptionUpdated:
          // update subscription in database
          console.log(
            `Subscription ${eventData.data.id} was updated`,
            eventData.data,
          )
          break

        case EventName.SubscriptionPaused:
          // pause subscription in database

          const pausedResult = await handleSubscriptionPaused({
            id: eventData.data.id,
            customerId: eventData.data.customerId,
            pausedAt: eventData.data.pausedAt || new Date().toISOString(),
          })

          if (!pausedResult.success) {
            console.error(
              'Failed to handle SubscriptionPaused:',
              pausedResult.errorMessage,
            )
          }

          console.log(
            `Subscription ${eventData.data.id} was paused for user ${eventData.data.customerId}`,
          )
          break

        case EventName.SubscriptionResumed:
          // resume subscription in database

          const resumedResult = await handleSubscriptionResumed({
            id: eventData.data.id,
            customerId: eventData.data.customerId,
            resumedAt: new Date().toISOString(), // Paddle no siempre envía resumedAt
          })

          if (!resumedResult.success) {
            console.error(
              'Failed to handle SubscriptionResumed:',
              resumedResult.errorMessage,
            )
          }

          console.log(
            `Subscription ${eventData.data.id} was resumed for user ${eventData.data.customerId}`,
          )
          break

        case EventName.SubscriptionPastDue:
          // past due subscription in database
          console.log(
            `Subscription ${eventData.data.id} was past due for user ${eventData.data.customerId}`,
          )
          break

        default:
          console.log('Unhandled event type:', eventData.eventType)
      }
    } else {
      console.log('Signature missing in header')
    }
  } catch (e) {
    // Handle signature mismatch or other runtime errors
    console.log(e)
  }
  // Return a response to acknowledge
  return NextResponse.json({
    ok: true,
  })
}
