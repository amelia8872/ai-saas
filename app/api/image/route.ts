import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getAuth } from '@clerk/nextjs/server';
import { increaseApiLimit, checkApiLimit } from '@/lib/api-limit';

const systemPrompt = `HeadStarter Project`;

export async function POST(req: NextRequest) {
  try {
    const openai = new OpenAI();
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const body = await req.json();

    const { prompt, amount = 1, resolution = '512x512' } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required!' },
        { status: 400 }
      );
    }

    if (!amount) {
      return NextResponse.json(
        { error: 'Prompt is required!' },
        { status: 400 }
      );
    }

    if (!resolution) {
      return NextResponse.json(
        { error: 'Prompt is required!' },
        { status: 400 }
      );
    }

    const freeTrial = await checkApiLimit();

    if (!freeTrial) {
      return new NextResponse('Free trial has expired.', { status: 403 });
    }

    const response = await openai.images.generate({
      model: 'dall-e-2',
      prompt,
      n: parseInt(amount, 10),
      size: resolution,
    });
    await increaseApiLimit();

    // console.log(response.data); array of objects,[{url:...}]

    return NextResponse.json(response.data);
  } catch (error) {
    console.log('IMAGE_ERROR', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
