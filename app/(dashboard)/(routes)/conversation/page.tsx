'use client';

import * as z from 'zod';
import axios from 'axios';

import Heading from '@/components/Heading';
import { Empty } from '@/components/Empty';
import { Loader } from '@/components/Loader';
import { UserAvatar } from '@/components/User-avatar';
import { BotAvatar } from '@/components/Bot-avatar';
import { Bot, MessageSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { formSchema } from './constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useProModal } from '@/hooks/use-pro-modal';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const ConversationPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const proModal = useProModal();

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // const response = await fetch('/api/conversation', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify([{ role: 'user', content: values.prompt }]),
      // });
      const response = await axios.post('/api/conversation', [
        { role: 'user', content: values.prompt },
      ]);

      console.log('API response:', response.data);

      const assistantMessage = response.data;
      if (!assistantMessage) {
        throw new Error('No assistant message found in response');
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'user', content: values.prompt },
        { role: 'assistant', content: assistantMessage },
      ]);

      form.reset();
    } catch (error: any) {
      console.log('Error status:', error.response?.status);
      if (error?.response?.status === 403) {
        console.log('403 error detected, opening modal...');
        proModal.onOpen();
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Conversation"
        description="Our most advanced conversation model"
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }: { field: any }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="How do I calculate the radius of a circle?"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <div>
              <Empty label="No conversation started!" />
            </div>
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message) => (
              <div
                key={message.content}
                className={cn(
                  'p-8 w-full flex items-start gap-x-8 rounded-lg',
                  message.role === 'user'
                    ? 'bg-white border border-black/10'
                    : 'bg-muted'
                )}
              >
                {message.role === 'user' ? <UserAvatar /> : <BotAvatar />}
                <p className="text-sm">{message.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
