import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getAuth } from '@clerk/nextjs/server';
import { increaseApiLimit, checkApiLimit } from '@/lib/api-limit';

const systemPrompt = `HeadStarter Project`;

export async function POST(req: NextRequest) {
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

  if (!body || !Array.isArray(body) || body.length === 0) {
    return NextResponse.json(
      { error: 'No messages provided' },
      { status: 400 }
    );
  }

  const freeTrial = await checkApiLimit();

  if (!freeTrial) {
    return new NextResponse('Free trial has expired.', { status: 403 });
  }

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'system', content: systemPrompt }, ...body],
    stream: true,
    model: 'gpt-4o-mini',
  });

  await increaseApiLimit();

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            const text = encoder.encode(content);
            controller.enqueue(text);
          }
        }
      } catch (error) {
        controller.error(error);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream);
}
