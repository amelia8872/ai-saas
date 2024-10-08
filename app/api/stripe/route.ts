import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { stripe } from '@/lib/stripe';
import { absoluteUrl } from '@/lib/utils';

const settingsUrl = absoluteUrl('/settings');

console.log('Settings URL:', settingsUrl);

export async function GET() {
  try {
    const { userId } = auth();

    const user = await currentUser();

    // console.log('User ID:', userId);
    // console.log('User Info:', user);

    if (!userId || !user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userSubscription = await prismadb.userSubscription.findUnique({
      where: {
        userId,
      },
    });

    if (userSubscription && userSubscription.stripeCustomerId) {
      // console.log('Stripe Customer ID:', userSubscription.stripeCustomerId);
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });

      // console.log('Stripe Billing Portal Session:', stripeSession);

      return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    }

    // console.log('Creating Stripe Checkout Session with data:', {
    //   success_url: settingsUrl,
    //   cancel_url: settingsUrl,
    //   customer_email: user.emailAddresses[0].emailAddress,
    //   userId,
    // });

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: 'USD',
            product_data: {
              name: 'Genius Pro',
              description: 'Unlimited AI Generations',
            },
            unit_amount: 2000,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
    });

    return new NextResponse(JSON.stringify({ url: stripeSession.url }));
  } catch (error) {
    console.log('[STRIPE_ERROR', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
