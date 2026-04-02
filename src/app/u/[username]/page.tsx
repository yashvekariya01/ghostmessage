'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { useCompletion } from 'ai/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessageString,
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: 'default',
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to sent message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      complete('');
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Handle error appropriately
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">
            Public Profile
          </h1>
          <p className="text-zinc-400 font-medium tracking-tight">Send an anonymous message to <span className="text-white font-mono">@{username}</span></p>
        </header>

        <Card className="bg-zinc-950 border-zinc-800 shadow-2xl backdrop-blur-sm">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">Your Anonymous Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write something nice..."
                          className="resize-none bg-black border-zinc-800 focus:border-zinc-500 transition-all min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center">
                  {isLoading ? (
                    <Button disabled className="bg-white text-black px-8 py-2 rounded-full">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </Button>
                  ) : (
                    <Button 
                        type="submit" 
                        disabled={isLoading || !messageContent}
                        className="bg-white text-black hover:bg-zinc-200 font-bold px-12 py-3 rounded-full active:scale-95 transition-all text-lg"
                    >
                      Send Message
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Button
              onClick={fetchSuggestedMessages}
              disabled={isSuggestLoading}
              variant="outline"
              className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 active:scale-95 transition-all w-full md:w-auto"
            >
              {isSuggestLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Suggest Messages
            </Button>
            <p className="text-zinc-500 text-sm font-medium tracking-tight">Click on any message below to select it.</p>
          </div>

          <Card className="bg-zinc-950 border-zinc-800 backdrop-blur-sm">
            <CardHeader className="border-b border-zinc-900">
              <h3 className="text-xl font-bold tracking-tight">AI Suggested Ideas</h3>
            </CardHeader>
            <CardContent className="flex flex-col space-y-3 pt-6">
              {error ? (
                <p className="text-rose-500 font-mono text-sm uppercase tracking-widest">{error.message}</p>
              ) : (
                parseStringMessages(completion).map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start text-left h-auto py-3 px-4 border-zinc-800 bg-black hover:bg-zinc-900 transition-all text-zinc-300 hover:text-white"
                    onClick={() => handleMessageClick(message)}
                  >
                    {message}
                  </Button>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <Separator className="bg-zinc-900" />

        <div className="text-center space-y-6 pb-12">
          <div className="text-zinc-400 font-medium tracking-tight">Want to receive anonymous messages?</div>
          <Link href={'/sign-up'}>
            <Button className="border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-8 py-6 rounded-full active:scale-95 transition-all">
              Create Your Own Board
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
