'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: 'Refreshed Messages',
            description: 'Showing latest messages',
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ?? 'Failed to fetch messages',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages, toast]
  );

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();

    fetchAcceptMessages();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

  // Handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to update message settings',
        variant: 'destructive',
      });
    }
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard.',
    });
  };


return (
  /* Next.js Pure Black Wrapper */
  <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black antialiased">
    
    <div className="mx-auto max-w-6xl px-6 py-12 md:py-20">
      <div className="flex flex-col space-y-12">
        
        {/* Header - Next.js Style */}
        <header className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter italic">
            Dashboard
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-white to-transparent" />
        </header>

        {/* Link Section - Ghost Card Style */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-8 backdrop-blur-sm">
          <h2 className="text-sm font-medium text-zinc-400 mb-4 tracking-tight">
            Unique Profile Link
          </h2>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="flex-1 bg-black border border-zinc-800 rounded-md px-4 py-2.5 text-sm font-mono text-zinc-400 outline-none focus:border-zinc-500 transition-colors"
            />
            <Button 
              onClick={copyToClipboard}
              className="bg-white text-black hover:bg-zinc-200 font-bold px-8 py-2.5 rounded-md transition-transform active:scale-95"
            >
              Copy
            </Button>
          </div>
        </section>

        {/* Controls - Minimalist */}
        <div className="flex items-center justify-between p-6 rounded-xl border border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-4">
            <Switch
              {...register('acceptMessages')}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
              className="data-[state=checked]:bg-white data-[state=unchecked]:bg-zinc-800"
            />
            <span className="text-sm font-medium tracking-tight text-zinc-300">
              Accepting Messages: <span className="text-white">{acceptMessages ? 'ON' : 'OFF'}</span>
            </span>
          </div>

          <Button
            variant="outline"
            className="hover:bg-zinc-900 border-zinc-800 text-zinc-400 active:scale-95 transition-all"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
          </Button>
        </div>

        <Separator className="bg-zinc-900" />

        {/* Messages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div key={message._id} className="transition-opacity hover:opacity-80">
                {/* Note: Update MessageCard to use bg-black and border-zinc-800 */}
                <MessageCard
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center border border-dashed border-zinc-800 rounded-2xl">
              <p className="text-zinc-600 font-mono text-sm uppercase tracking-widest">
                No incoming data.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
}

export default UserDashboard;
