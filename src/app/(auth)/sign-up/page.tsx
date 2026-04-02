'use client';

import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounce } from 'usehooks-ts';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedUsername = useDebounce(username, 300);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage(''); // Reset message
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${debouncedUsername}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? 'Error checking username'
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);

      toast({
        title: 'Success',
        description: response.data.message,
      });

      router.replace(`/verify/${username}`);

      setIsSubmitting(false);
    } catch (error) {
      console.error('Error during sign-up:', error);

      const axiosError = error as AxiosError<ApiResponse>;

      // Default error message
      let errorMessage = axiosError.response?.data.message;
      ('There was a problem with your sign-up. Please try again.');

      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-zinc-950 rounded-2xl border border-zinc-800 shadow-2xl backdrop-blur-sm">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tighter text-white">
            Join ghostmessage
          </h1>
          <p className="text-zinc-400 text-sm font-medium tracking-tight">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Username</FormLabel>
                   <div className="relative">
                    <Input
                        {...field}
                        onChange={(e) => {
                        field.onChange(e);
                        setUsername(e.target.value);
                        }}
                        className="bg-black border-zinc-800 focus:border-zinc-500 transition-all font-mono"
                    />
                    {isCheckingUsername && <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-zinc-500" />}
                  </div>
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-xs font-mono uppercase tracking-[0.1em] mt-1.5 ${
                        usernameMessage === 'Username is unique'
                          ? 'text-emerald-500'
                          : 'text-rose-500'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Email</FormLabel>
                  <Input {...field} name="email" className="bg-black border-zinc-800 focus:border-zinc-500 transition-all font-mono" />
                  <p className='text-zinc-500 text-[10px] uppercase font-mono tracking-wider pt-1'>We will send you a verification code</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Password</FormLabel>
                  <Input type="password" {...field} name="password" className="bg-black border-zinc-800 focus:border-zinc-500 transition-all font-mono" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full bg-white text-black hover:bg-zinc-200 font-bold active:scale-95 transition-all' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p className="text-zinc-400 text-sm">
            Already a member?{' '}
            <Link href="/sign-in" className="text-white hover:underline font-bold transition-all">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

