import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';
import { getAuth } from '@clerk/nextjs/server';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    const body = await req.json();
    const { prompt } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const input = {
      prompt: 'Clown fish swimming in a coral reef',
    };

    const response = await replicate.run(
      'anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351',
      { input }
    );
    // console.log(response);

    return NextResponse.json(response);
  } catch (error) {
    console.log('VIDEO_ERROR', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
