import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const systemPrompt = `HeadStarter Project`;

export async function POST(req: NextRequest) {
  const openai = new OpenAI();
  const data = await req.json();

  // if (!Array.isArray(data)) {
  //   return NextResponse.json(
  //     { error: 'Invalid request body. Expected an array of messages.' },
  //     { status: 400 }
  //   );
  // }

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'system', content: systemPrompt }, ...data],
    stream: true,
    model: 'gpt-4o-mini',
  });

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
