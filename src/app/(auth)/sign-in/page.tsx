'use client';

import React from 'react';  
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast'; 
import { signInSchema } from '@/schemas/signInSchema';

export default function SignInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const { toast } = useToast();
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast({
          title: 'Login Failed',
          description: 'Incorrect username or password',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    }

    if (result?.url) {
      router.replace('/dashboard');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-zinc-950 rounded-2xl border border-zinc-800 shadow-2xl backdrop-blur-sm">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tighter text-white">
            Welcome Back
          </h1>
          <p className="text-zinc-400 text-sm font-medium tracking-tight">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Email/Username</FormLabel>
                  <Input {...field} className="bg-black border-zinc-800 focus:border-zinc-500 transition-all font-mono" />
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
                  <Input type="password" {...field} className="bg-black border-zinc-800 focus:border-zinc-500 transition-all font-mono" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='w-full bg-white text-black hover:bg-zinc-200 font-bold active:scale-95 transition-all' type="submit">Sign In</Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p className="text-zinc-400 text-sm">
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-white hover:underline font-bold transition-all">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
