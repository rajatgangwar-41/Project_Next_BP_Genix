import Stripe from "stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"
import { stripe } from "@/lib/stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new NextResponse(`Webhook Error: ${error.message}`, {
        status: 400,
      })
    }
    return new NextResponse(`Webhook Error: Unknown error`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    if (!session?.metadata?.userId) {
      return new NextResponse("User id is required", { status: 400 })
    }

    const anchor = subscription.billing_cycle_anchor
    if (!anchor) {
      console.error("Missing billing_cycle_anchor")
      return new NextResponse("Missing billing cycle anchor", { status: 400 })
    }

    const stripeCurrentPeriodEnd = new Date(anchor * 1000)
    stripeCurrentPeriodEnd.setMonth(stripeCurrentPeriodEnd.getMonth() + 1)

    await prismadb.userSubscription.create({
      data: {
        userId: session.metadata.userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd,
      },
    })
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    const anchor = subscription.billing_cycle_anchor
    if (!anchor) {
      console.error("Missing billing_cycle_anchor")
      return new NextResponse("Missing billing cycle anchor", {
        status: 400,
      })
    }

    const stripeCurrentPeriodEnd = new Date(anchor * 1000)
    stripeCurrentPeriodEnd.setMonth(stripeCurrentPeriodEnd.getMonth() + 1)

    await prismadb.userSubscription.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd,
      },
    })
  }

  return new NextResponse(null, { status: 200 })
}
