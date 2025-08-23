import { createClient } from '@/lib/supabase/server'
import { Environment, EventName, Paddle } from '@paddle/paddle-node-sdk'
import { NextRequest, NextResponse } from 'next/server'

const paddle = new Paddle(process.env.PADDLE_SECRET_TOKEN!, {
  environment: Environment.sandbox,
})

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.error('supabase error', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  console.log('we are going to process the webhook for user', user?.email)

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
        case EventName.SubscriptionActivated:
          // activate subscription in database
          console.log(`Product ${eventData.data.id} was activated`)
          break
        case EventName.SubscriptionCanceled:
          // deactivate subscription in database
          console.log(`Subscription ${eventData.data.id} was canceled`)
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
          console.log(`Subscription ${eventData.data.id} was paused`)
          break
        case EventName.SubscriptionResumed:
          // resume subscription in database
          console.log(`Subscription ${eventData.data.id} was resumed`)
          break
        case EventName.SubscriptionPastDue:
          // past due subscription in database
          console.log(`Subscription ${eventData.data.id} was past due`)
          break
        default:
          console.log(eventData.eventType)
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
